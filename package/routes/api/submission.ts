import config from 'astro-feedback:config';
import routes from 'astro-feedback:routes';
import { db, eq } from 'astro:db';
import type { APIContext, APIRoute } from 'astro';
import { z } from 'astro/zod';
import { verifyRequestOrigin } from 'lucia';
import {
	type PatchAPISubmissionType,
	type SubmissionTableType,
	type TeamTableTyped,
	tsAdmin,
	tsProject,
	tsSubmission,
	tsTeam,
	tsUser,
} from '../../db/tsTables';
import { lucia } from '../lib/auth';

const { accessControlAllowOrigin } = config;

export const prerender = false;

const headers = {
	'ACCESS-CONTROL-ALLOW-ORIGIN': '*',
};

const jsonHeaders = {
	'Content-Type': 'application/json',
	'ACCESS-CONTROL-ALLOW-ORIGIN': '*',
};

const badRequest = new Response(null, {
	status: 400,
	statusText: 'Bad Request',
	headers: headers,
});

export const GET: APIRoute = async ({ request, locals, cookies }: APIContext) => {
	////// ACCESS CONTROL //////
	const originHeader = request.headers.get('origin');
	const hostHeader = request.headers.get('host');
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader, ...accessControlAllowOrigin])
	) {
		return new Response(null, { status: 403, statusText: 'Forbidden' });
	}
	////////////////////////////

	// Get the user session
	let userSession = locals.session;

	// If the user session is not set, check if the auth session cookie is set
	if (locals.session === null) {
		// Get the auth session cookie
		const authSessionCookie = cookies.get(lucia.sessionCookieName);

		// If the auth session cookie is not set, return early
		if (authSessionCookie === undefined) {
			userSession = null;
			return badRequest;
		}

		// Validate the user session
		const { session } = await lucia.validateSession(authSessionCookie.value);

		// Set the user session if it is valid
		userSession = session;
	}

	// Check if the user is logged in
	let isLoggedInUser = false;

	// If the user session is set, check if the user is logged in
	if (userSession) {
		// Get the user data from the database
		const user = await db.select().from(tsUser).where(eq(tsUser.id, userSession.userId)).get();

		// Set the isLoggedInUser flag to true if the user is found
		isLoggedInUser = !!user;
	}

	// If the user is not logged in, return a error
	if (!isLoggedInUser) {
		return new Response(null, {
			status: 403,
			statusText: 'Forbidden',
			headers: headers,
		});
	}

	// Parse the request body as JSON
	const jsonData = await request.json();

	// Get the submission ID from the request body
	const { submissionId } = jsonData;

	// If the submission ID is not provided, return a error
	if (!submissionId) {
		return new Response(JSON.stringify({ message: 'Submission ID is required' }), {
			status: 400,
			statusText: 'Bad Request',
			headers: jsonHeaders,
		});
	}

	// Get the submission from the database
	const submission = await db
		.select()
		.from(tsSubmission)
		.where(eq(tsSubmission.id, submissionId))
		.get();

	// If the submission is not found, return a error
	if (!submission) {
		return new Response(JSON.stringify({ message: 'Submission not found' }), {
			status: 404,
			statusText: 'Not Found',
			headers: jsonHeaders,
		});
	}

	// Return the submission data
	return new Response(JSON.stringify(submission), {
		status: 200,
		statusText: 'OK',
		headers: jsonHeaders,
	});
};

export const POST: APIRoute = async ({ request, locals, cookies }: APIContext) => {
	////// ACCESS CONTROL //////
	const originHeader = request.headers.get('origin');
	const hostHeader = request.headers.get('host');
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader, ...accessControlAllowOrigin])
	) {
		return new Response(null, { status: 403, statusText: 'Forbidden' });
	}
	////////////////////////////

	const formData = await request.formData();

	// Required fields
	const projectId = formData.get('projectId');
	const subject = formData.get('subject');
	const body = formData.get('body');

	// Optional fields
	const userId = formData.get('userId');
	const email = formData.get('email');

	// Get the user session
	let userSession = locals.session;

	// If the user session is not set, check if the auth session cookie is set
	if (locals.session === null) {
		// Get the auth session cookie
		const authSessionCookie = cookies.get(lucia.sessionCookieName);

		// If the auth session cookie is not set, return early
		if (authSessionCookie === undefined) {
			userSession = null;
			return badRequest;
		}

		// Validate the user session
		const { session } = await lucia.validateSession(authSessionCookie.value);

		// Set the user session if it is valid
		userSession = session;
	}

	// Check if the user is logged in
	let isLoggedInUser = false;

	// If the user session is set, check if the user is logged in
	if (userSession) {
		// Get the user data from the database
		const user = await db.select().from(tsUser).where(eq(tsUser.id, userSession.userId)).get();

		// Set the isLoggedInUser flag to true if the user is found
		isLoggedInUser = !!user;
	}

	// Validate required fields exist
	if (!projectId || !subject || !body) {
		return badRequest;
	}

	if (typeof projectId !== 'string' || typeof subject !== 'string' || typeof body !== 'string') {
		return badRequest;
	}

	// Validate projectId
	const existingProject = await db
		.select()
		.from(tsProject)
		.where(eq(tsProject.id, projectId))
		.get();

	if (!existingProject) {
		return badRequest;
	}

	// Validate optional fields
	const emailSchema = z.coerce.string().email();
	if (email) {
		if (typeof email !== 'string') {
			return badRequest;
		}
		const emailValidation = emailSchema.safeParse(email);
		if (!emailValidation.success) {
			return badRequest;
		}
	}

	if (userId) {
		if (typeof userId !== 'string') {
			return badRequest;
		}
		const existingUser = await db.select().from(tsUser).where(eq(tsUser.id, userId)).get();
		if (!existingUser) {
			// UserId provided but not found in the database
			return badRequest;
		}
	}

	const NOW = new Date();

	// Insert the feedback
	const insertedFeedback = await db
		.insert(tsSubmission)
		.values({
			id: crypto.randomUUID(),
			projectId: projectId,
			userId: userId || null,
			email: email || null,
			subject: subject,
			body: body,
			createdAt: NOW,
			updatedAt: NOW,
			status: 'open',
		})
		.returning({
			id: tsSubmission.id,
			projectId: tsSubmission.projectId,
		})
		.get();

	if (!insertedFeedback) {
		return new Response(null, {
			status: 500,
			statusText: 'Internal Server Error',
			headers: headers,
		});
	}

	const { id: submissionId, projectId: submissionProject } = insertedFeedback;

	const newSubmissionPath = `${routes.portal.projects.index}/${submissionProject}/submissions/${submissionId}`;

	return new Response(
		JSON.stringify(
			{
				message: 'Feedback Submitted Successfully, Thank you!',
				submissionPath: newSubmissionPath,
				isLoggedInUser: isLoggedInUser,
			},
			null,
			2
		),
		{
			status: 200,
			statusText: 'Feedback Submitted Successfully',
			headers: jsonHeaders,
		}
	);
};

export const DELETE: APIRoute = async ({ request, locals, cookies }: APIContext) => {
	////// ACCESS CONTROL //////
	const originHeader = request.headers.get('origin');
	const hostHeader = request.headers.get('host');
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader, ...accessControlAllowOrigin])
	) {
		return new Response(null, { status: 403, statusText: 'Forbidden' });
	}
	////////////////////////////

	// Get the user session
	let userSession = locals.session;

	// If the user session is not set, check if the auth session cookie is set
	if (locals.session === null) {
		// Get the auth session cookie
		const authSessionCookie = cookies.get(lucia.sessionCookieName);

		// If the auth session cookie is not set, return early
		if (authSessionCookie === undefined) {
			userSession = null;
			return badRequest;
		}

		// Validate the user session
		const { session } = await lucia.validateSession(authSessionCookie.value);

		// Set the user session if it is valid
		userSession = session;
	}

	// If the user session is set, check if the user is logged in
	if (userSession) {
		// Get the user data from the database
		const user = await db.select().from(tsUser).where(eq(tsUser.id, userSession.userId)).get();

		// If the user is not found, return a error
		if (!user) {
			return new Response(null, {
				status: 403,
				statusText: 'Forbidden',
				headers: headers,
			});
		}

		// Check if the user is an admin
		const admin = await db.select().from(tsAdmin).where(eq(tsAdmin.userId, user.id)).get();

		// If the user is not an admin, return a error
		if (!admin) {
			return new Response(null, {
				status: 403,
				statusText: 'Must be an admin to delete submissions',
				headers: headers,
			});
		}
	}

	// Get the submission information from the form data
	const formData = await request.formData();

	// Get the submission ID from the form data
	const submissionId = formData.get('submissionId');

	// If the submission ID is not provided, return a error
	if (!submissionId || typeof submissionId !== 'string') {
		return new Response(null, {
			status: 400,
			statusText: 'Submission ID is required',
			headers: headers,
		});
	}

	// Get the submission from the database
	const submission = await db
		.select()
		.from(tsSubmission)
		.where(eq(tsSubmission.id, submissionId))
		.get();

	// If the submission is not found, return a error
	if (!submission) {
		return new Response(null, {
			status: 404,
			statusText: 'Submission not found',
			headers: headers,
		});
	}

	// Delete the submission from the database
	try {
		await db.delete(tsSubmission).where(eq(tsSubmission.id, submissionId));
		// Return a success message
		return new Response(null, {
			status: 204,
			statusText: 'Submission Deleted Successfully',
			headers: headers,
		});
	} catch (error) {
		// Log the error and return a error
		console.error('Error: Something went wrong', error);
		return new Response(null, {
			status: 500,
			statusText: 'Internal Server Error',
			headers: headers,
		});
	}
};

export const PUT: APIRoute = async ({ request, locals, cookies }: APIContext) => {
	////// ACCESS CONTROL //////
	const originHeader = request.headers.get('origin');
	const hostHeader = request.headers.get('host');
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader, ...accessControlAllowOrigin])
	) {
		return new Response(null, { status: 403, statusText: 'Forbidden' });
	}
	////////////////////////////

	// Get the user session
	let userSession = locals.session;

	// If the user session is not set, check if the auth session cookie is set
	if (locals.session === null) {
		// Get the auth session cookie
		const authSessionCookie = cookies.get(lucia.sessionCookieName);

		// If the auth session cookie is not set, return early
		if (authSessionCookie === undefined) {
			userSession = null;
			return badRequest;
		}

		// Validate the user session
		const { session } = await lucia.validateSession(authSessionCookie.value);

		// Set the user session if it is valid
		userSession = session;
	}

	// If the user session is set, check if the user is logged in
	if (!userSession) {
		return new Response(null, {
			status: 403,
			statusText: 'Forbidden',
			headers: headers,
		});
	}

	// Get the user data from the database
	const user = await db.select().from(tsUser).where(eq(tsUser.id, userSession.userId)).get();

	// If the user is not found, return a error
	if (!user) {
		return new Response(null, {
			status: 403,
			statusText: 'Forbidden',
			headers: headers,
		});
	}

	// Check if the user is an admin
	const isAdmin = await db.select().from(tsAdmin).where(eq(tsAdmin.userId, user.id)).get();

	// Get the JSON data from the request
	const jsonData: typeof tsSubmission.$inferSelect = await request.json();

	// Get the submission info from the JSON data
	const submissionId = jsonData.id;

	// If the submission ID is not provided, return a error
	if (!submissionId) {
		return new Response(null, {
			status: 400,
			statusText: 'Submission ID is required',
			headers: headers,
		});
	}

	// Get the submission from the database
	const existingSubmission = await db
		.select()
		.from(tsSubmission)
		.where(eq(tsSubmission.id, submissionId))
		.get();

	// If the submission is not found, return a error
	if (!existingSubmission) {
		return new Response(null, {
			status: 404,
			statusText: 'Submission not found',
			headers: headers,
		});
	}

	// Check if the user is part of the Team of the project
	const project = await db
		.select()
		.from(tsProject)
		.where(eq(tsProject.id, existingSubmission.projectId))
		.get();

	// If the project is not found, return a error
	if (!project) {
		return new Response(null, {
			status: 404,
			statusText: 'Project not found',
			headers: headers,
		});
	}

	const team = (await db
		.select()
		.from(tsTeam)
		.where(eq(tsTeam.id, project.teamId))
		.get()) as TeamTableTyped;

	// If the team is not found, return a error
	if (!team) {
		return new Response(null, {
			status: 404,
			statusText: 'Team not found',
			headers: headers,
		});
	}

	const userInTeam = team.users.includes(user.id);

	// Check if the user is the owner of the submission or an admin
	if (existingSubmission.userId !== user.id) {
		if (!userInTeam) {
			if (!isAdmin) {
				return new Response(null, {
					status: 403,
					statusText: 'Forbidden',
					headers: headers,
				});
			}
		}
	}

	// remap the JSON data to the submission schema
	const submissionData: typeof tsSubmission.$inferInsert = {
		id: existingSubmission.id,
		createdAt: existingSubmission.createdAt,
		projectId: jsonData.projectId || existingSubmission.projectId,
		updatedAt: new Date(),
		userId: jsonData.userId || existingSubmission.userId,
		email: jsonData.email || existingSubmission.email,
		status: jsonData.status || existingSubmission.status,
		body: jsonData.body || existingSubmission.body,
		subject: jsonData.subject || existingSubmission.subject,
		responses: jsonData.responses || existingSubmission.responses,
	};

	// Update the submission in the database
	try {
		await db.update(tsSubmission).set(submissionData).where(eq(tsSubmission.id, submissionId));
		// Return a success message
		return new Response(null, {
			status: 200,
			statusText: 'Submission Updated Successfully',
			headers: headers,
		});
	} catch (error) {
		// Log the error and return a error
		console.error('Error: Something went wrong', error);
		return new Response(null, {
			status: 500,
			statusText: 'Internal Server Error',
			headers: headers,
		});
	}
};

export const PATCH: APIRoute = async ({ request, locals, cookies }: APIContext) => {
	////// ACCESS CONTROL //////
	const originHeader = request.headers.get('origin');
	const hostHeader = request.headers.get('host');
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader, ...accessControlAllowOrigin])
	) {
		return new Response(null, { status: 403, statusText: 'Forbidden' });
	}
	////////////////////////////

	// Get the user session
	let userSession = locals.session;

	// If the user session is not set, check if the auth session cookie is set
	if (locals.session === null) {
		// Get the auth session cookie
		const authSessionCookie = cookies.get(lucia.sessionCookieName);

		// If the auth session cookie is not set, return early
		if (authSessionCookie === undefined) {
			userSession = null;
			return badRequest;
		}

		// Validate the user session
		const { session } = await lucia.validateSession(authSessionCookie.value);

		// Set the user session if it is valid
		userSession = session;
	}

	// If the user session is set, check if the user is logged in
	if (!userSession) {
		return new Response(null, {
			status: 403,
			statusText: 'Forbidden',
			headers: headers,
		});
	}

	// Get the user data from the database
	const user = await db.select().from(tsUser).where(eq(tsUser.id, userSession.userId)).get();

	// If the user is not found, return a error
	if (!user) {
		return new Response(null, {
			status: 403,
			statusText: 'Forbidden',
			headers: headers,
		});
	}

	// Check if the user is an admin
	const isAdmin = await db.select().from(tsAdmin).where(eq(tsAdmin.userId, user.id)).get();

	// Get the JSON data from the request
	const jsonData: PatchAPISubmissionType = await request.json();

	// Get the submission info from the JSON data
	const submissionId = jsonData.id;

	// If the submission ID is not provided, return a error
	if (!submissionId) {
		return new Response(null, {
			status: 400,
			statusText: 'Submission ID is required',
			headers: headers,
		});
	}

	// Get the submission from the database
	const existingSubmission = await db
		.select()
		.from(tsSubmission)
		.where(eq(tsSubmission.id, submissionId))
		.get();

	// If the submission is not found, return a error
	if (!existingSubmission) {
		return new Response(null, {
			status: 404,
			statusText: 'Submission not found',
			headers: headers,
		});
	}

	// Check if the user is part of the Team of the project
	const project = await db
		.select()
		.from(tsProject)
		.where(eq(tsProject.id, existingSubmission.projectId))
		.get();

	// If the project is not found, return a error
	if (!project) {
		return new Response(null, {
			status: 404,
			statusText: 'Project not found',
			headers: headers,
		});
	}

	const team = (await db
		.select()
		.from(tsTeam)
		.where(eq(tsTeam.id, project.teamId))
		.get()) as TeamTableTyped;

	// If the team is not found, return a error
	if (!team) {
		return new Response(null, {
			status: 404,
			statusText: 'Team not found',
			headers: headers,
		});
	}

	const userInTeam = team.users.includes(user.id);

	// Check if the user is the owner of the submission or an admin
	if (existingSubmission.userId !== user.id) {
		if (!userInTeam) {
			if (!isAdmin) {
				return new Response(null, {
					status: 403,
					statusText: 'Forbidden',
					headers: headers,
				});
			}
		}
	}

	// Get the existing responses
	let existingResponses = JSON.parse(
		existingSubmission.responses as string
	) as SubmissionTableType['responses'];

	// Get the new response from the JSON data
	const newResponse = jsonData.response;

	// If the new response is not provided, return a error
	if (!newResponse) {
		return new Response(null, {
			status: 400,
			statusText: 'Response is required',
			headers: headers,
		});
	}

	// Get the user ID from the new response
	const userId = user.id;

	// Create a new response object
	const response = {
		userId: userId,
		body: newResponse,
		createdAt: new Date(),
	};

	// Add the new response to the existing responses
	if (!existingResponses) {
		existingResponses = [];
	}

	existingResponses.push(response);

	// remap the JSON data to the submission schema
	const submissionData: typeof tsSubmission.$inferInsert = {
		id: existingSubmission.id,
		createdAt: existingSubmission.createdAt,
		projectId: existingSubmission.projectId,
		updatedAt: new Date(),
		userId: existingSubmission.userId,
		email: existingSubmission.email,
		status: jsonData.status,
		body: existingSubmission.body,
		subject: existingSubmission.subject,
		responses: existingResponses,
	};

	// Update the submission in the database
	try {
		await db.update(tsSubmission).set(submissionData).where(eq(tsSubmission.id, submissionId));
		// Return a success message
		return new Response(null, {
			status: 204,
			statusText: 'Submission Updated Successfully',
			headers: headers,
		});
	} catch (error) {
		// Log the error and return a error
		console.error('Error: Something went wrong', error);
		return new Response(null, {
			status: 500,
			statusText: 'Internal Server Error',
			headers: headers,
		});
	}
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		statusText: 'No Content',
		headers: {
			Allow: 'OPTIONS, GET, POST, DELETE, PATCH, PUT',
			'ALLOW-ACCESS-CONTROL-ORIGIN': '*',
			'Cache-Control': 'public, max-age=604800, immutable',
			Date: new Date().toUTCString(),
		},
	});
};

export const ALL: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
		headers: headers,
	});
};
