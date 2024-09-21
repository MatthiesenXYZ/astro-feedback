import config from 'astro-feedback:config';
import { db, eq } from 'astro:db';
import type { APIContext, APIRoute } from 'astro';
import { verifyRequestOrigin } from 'lucia';
import { tsAdmin, tsProject, tsUser } from '../../db/tsTables';
import { lucia } from '../lib/auth';

const { accessControlAllowOrigin } = config;

export const prerender = false;

export const GET: APIRoute = async (context: APIContext) => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
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

	const authSessionCookie = cookies.get(lucia.sessionCookieName);

	if (!authSessionCookie) {
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized',
		});
	}

	const { session, user } = await lucia.validateSession(authSessionCookie.value);

	if (!session) {
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized',
		});
	}

	if (!user) {
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized',
		});
	}

	if (session.expiresAt < new Date()) {
		await lucia.invalidateSession(session.id);

		cookies.delete(lucia.sessionCookieName);
		cookies.delete('github_oauth_state');

		const blankSessionCookie = lucia.createBlankSessionCookie();

		cookies.set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);

		locals.session = null;
		locals.user = null;
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized',
		});
	}

	// Check if user is an admin
	const isAdmin = await db.select().from(tsAdmin).where(eq(tsAdmin.userId, user.id)).get();

	if (!isAdmin) {
		return new Response(null, {
			status: 403,
			statusText: 'Forbidden',
		});
	}

	const formData = await request.formData();

	const title = formData.get('project-title') as string;
	const description = formData.get('project-description') as string;
	const teamId = formData.get('project-team') as string;
	const submissionsOpen = formData.get('project-submissions') as string;
	const defaultProject = formData.get('project-default') as string;

	// Validate form data
	if (!title || !description || !teamId || !submissionsOpen || !defaultProject) {
		return new Response(null, {
			status: 400,
			statusText: 'Bad Request',
		});
	}

	// Create project
	try {
		const newProject: typeof tsProject.$inferInsert = {
			title,
			description,
			teamId,
			owner: isAdmin.id,
			defaultProject: defaultProject === 'true',
			submissionsOpen: submissionsOpen === 'true',
			id: crypto.randomUUID(),
			createdAt: new Date(),
		};

		const project = await db
			.insert(tsProject)
			.values(newProject)
			.returning({ id: tsProject.id })
			.get();

		return new Response('Project created', {
			status: 201,
			statusText: 'Project Created',
			headers: {
				'Content-Type': 'text/plain',
				Location: `/portal/projects/${project.id}`,
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			return new Response(error.message, {
				status: 500,
				statusText: 'Internal Server Error',
			});
		}
		return new Response('Unknown Error', {
			status: 500,
			statusText: 'Internal Server Error',
		});
	}
};

export const HEAD: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const PUT: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const DELETE: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const CONNECT: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const TRACE: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const PATCH: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const ALL: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
	});
};
