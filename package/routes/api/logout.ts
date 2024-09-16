import r from 'astro-feedback:routes';
import type { APIContext, APIRoute } from 'astro';
import { lucia } from '../../routes/lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ locals, cookies, redirect }: APIContext) => {
	// If the user is not logged in, redirect them to the login page
	const authSessionCookie = cookies.get('auth_session');

	if (!locals.session) {
		if (!authSessionCookie) {
			return redirect(r.portal.login);
		}
	}

	// Invalidate the current session
	await lucia.invalidateSession(locals.session?.id || authSessionCookie?.value || '');

	// Create a new session cookie
	const sessionCookie = lucia.createBlankSessionCookie();

	// Set the new session cookie in the response
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// Clear the auth session and state cookies
	cookies.delete('auth_session');
	cookies.delete('github_oauth_state');

	// Clear the session and user locals
	locals.session = null;
	locals.user = null;

	// Redirect the user to the home page
	return redirect(r.base.index);
};

export const POST: APIRoute = async (context: APIContext) => {
	return GET(context);
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		statusText: 'No Content',
		headers: {
			Allow: 'OPTIONS, GET, POST',
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
