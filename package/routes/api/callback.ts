import r from 'astro-feedback:routes';
import { db, eq } from 'astro:db';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from 'astro:env/server';
import { GitHub, OAuth2RequestError } from 'arctic';
import type { APIContext, APIRoute } from 'astro';
import { tsUser } from '../../db/tsTables';
import { lucia } from '../lib/auth';

const convertGithubUserType = ({
	avatar_url,
	login,
	email,
	html_url,
	id,
	name,
}: GitHubUserResponseType): typeof tsUser.$inferInsert => {
	return {
		id: crypto.randomUUID(),
		url: html_url,
		username: login,
		name: name,
		email: email,
		githubId: id,
		avatar: avatar_url,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};

interface GitHubUserResponseType {
	id: number;
	html_url: string;
	login: string;
	avatar_url: string;
	name: string;
	email: string | null;
	gravatar_id: string | null;
}

interface GitHubUserEmailResponseType {
	email: string;
	verified: boolean;
	primary: boolean;
	visibility: string;
}

const loginPage = r.portal.login;
const redirectAfterLogin = r.base.index;

export const GET: APIRoute = async ({ url, cookies, redirect }: APIContext) => {
	// Create a new instance of the GitHub Client
	const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

	// Get the code and state from the URL
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	// Get the stored state from the cookie
	const storedState = cookies.get('github_oauth_state')?.value ?? null;

	// If the code, state, or storedState is missing, redirect the user to the login page
	if (!code || !state || !storedState || state !== storedState) {
		console.log('missing code, state, or storedState');
		return redirect(loginPage);
	}

	try {
		// Validate the authorization code
		const tokens = await github.validateAuthorizationCode(code);

		// Get the user data from GitHub
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		// If the GitHub API response is not 200, log the error and return a 500 error
		if (githubUserResponse.status !== 200) {
			console.error('GitHub API error:', githubUserResponse);
			return new Response('Error: Could not get user data from GitHub', { status: 500 });
		}

		// Get the user data from the response
		const {
			avatar_url: response_avatar_url,
			html_url,
			id,
			login,
			name,
			gravatar_id,
		}: GitHubUserResponseType = await githubUserResponse.json();

		// Get the user email from GitHub
		const githubUserEmailResponse = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		// Get the user emails from the response
		const emails: GitHubUserEmailResponseType[] = await githubUserEmailResponse.json();

		// Find the primary email that is verified and public if possible
		const email =
			emails.find((single) => {
				const { verified, primary, visibility, email } = single;

				if (primary && verified && visibility === 'public') {
					return email;
				}
				if (primary && verified) {
					return email;
				}
				if (verified && visibility === 'public') {
					return email;
				}
				if (verified) {
					return email;
				}
				return null;
			})?.email ?? null;

		// If the user does not have a avatar URL, use the Gravatar URL
		const avatar_url =
			response_avatar_url ?? `https://www.gravatar.com/avatar/${gravatar_id}?d=retro`;

		// Create a new user object with all the collected user data
		const githubUser: GitHubUserResponseType = {
			avatar_url,
			html_url,
			id,
			login,
			name,
			email,
			gravatar_id,
		};

		// Check if the user already exists in the database
		const existingUser = await db
			.select()
			.from(tsUser)
			.where(eq(tsUser.githubId, githubUser.id))
			.get();

		// If the user exists, create a new session and set the session cookie
		if (existingUser) {
			console.log('existingUser', existingUser);
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return redirect(redirectAfterLogin);
		}

		// Convert the GitHub user object to a database user object
		const newUser = convertGithubUserType(githubUser);

		// Insert the new user into the database
		const insertResult = await db.insert(tsUser).values(newUser).returning({ id: tsUser.id }).get();

		// Create a new session for the new user
		const newUserSession = await lucia.createSession(insertResult.id, {});

		// Create a new session cookie for the new user
		const newUserSessionCookie = lucia.createSessionCookie(newUserSession.id);

		// Set the new session cookie in the response
		cookies.set(
			newUserSessionCookie.name,
			newUserSessionCookie.value,
			newUserSessionCookie.attributes
		);

		// Redirect the user to the home page after login
		console.log('newUser', newUser);
		return redirect(redirectAfterLogin);
	} catch (error) {
		// If the error is an OAuth2RequestError, log the error and return a 400 error
		if (error instanceof OAuth2RequestError) {
			const { message, description, request, cause } = error;

			console.error('OAuth2RequestError:', { message, description, request, cause });

			return new Response(`Error: ${message}`, {
				status: 400,
				statusText: description ?? 'Bad Request',
			});
		}
		// If the error is not an OAuth2RequestError, log the error and return a 500 error
		console.log('Error: Something went wrong', error);
		return new Response('Error: Something went wrong', { status: 500 });
	}
};

export const POST: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
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
