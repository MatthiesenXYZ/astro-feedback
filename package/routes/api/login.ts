import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from 'astro:env/server';
import { generateState } from 'arctic';
import { GitHub } from 'arctic';
import type { APIContext, APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ redirect, cookies }: APIContext) => {
	// Create a new instance of the GitHub Client
	const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

	// Generate a new state
	const state = generateState();

	// Create a new authorization URL
	const url = await github.createAuthorizationURL(state, {
		scopes: ['user:email'],
	});

	// Set the state in a cookie for later validation
	cookies.set('github_oauth_state', state, {
		path: import.meta.env.BASE_URL,
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	});

	// Redirect the user to the GitHub authorization URL
	return redirect(url.toString());
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		statusText: 'No Content',
		headers: {
			Allow: 'OPTIONS, GET',
			Date: new Date().toUTCString(),
			'Cache-Control': 'public, max-age=604800, immutable',
		},
	});
};

export const ALL: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
	});
};
