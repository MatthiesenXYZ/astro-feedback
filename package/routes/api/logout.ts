import r from 'astro-feedback:routes';
import type { APIContext, APIRoute } from 'astro';
import { lucia } from 'routes/lib/auth';

export const GET: APIRoute = async ({ locals, cookies, redirect }: APIContext) => {
	// If the user is not logged in, redirect them to the login page
	if (!locals.session) {
		return redirect(r.portal.login);
	}

	// Invalidate the current session
	await lucia.invalidateSession(locals.session.id);

	// Create a new session cookie
	const sessionCookie = lucia.createBlankSessionCookie();

	// Set the new session cookie in the response
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// Clear the session and user locals
	locals.session = null;
	locals.user = null;

	// Redirect the user to the home page
	return redirect(r.base.index);
};

export const POST: APIRoute = async ({ locals, cookies, redirect }: APIContext) => {
	// If the user is not logged in, redirect them to the login page
	if (!locals.session) {
		return redirect(r.portal.login);
	}

	// Invalidate the current session
	await lucia.invalidateSession(locals.session.id);

	// Create a new session cookie
	const sessionCookie = lucia.createBlankSessionCookie();

	// Set the new session cookie in the response
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// Clear the session and user locals
	locals.session = null;
	locals.user = null;

	// Redirect the user to the home page
	return redirect(r.base.index);
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
