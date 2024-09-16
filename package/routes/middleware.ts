import routes from 'astro-feedback:routes';
import { verifyRequestOrigin } from 'lucia';
import { lucia } from './lib/auth.ts';
import { defineMiddlewareRouter } from './lib/middlewareRouter.ts';
import type { Router } from './lib/types.ts';

// Define a middleware router that routes requests to different handlers based on the request path.
const router: Router = {};

// Route all requests to the root path to set the `user` and `session` locals.
router['/portal/!(login)**'] = async ({ request, cookies, locals, redirect }, next) => {
	// If the request method is not `GET`, check if the request origin is allowed.
	if (request.method !== 'GET') {
		const originHeader = request.headers.get('Origin');
		const hostHeader = request.headers.get('Host');

		// If the request origin is not allowed, return a `403 Forbidden` response.
		if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
			return new Response(null, {
				status: 403,
			});
		}
	}

	// Get the session ID from the session cookie
	const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;

	// If the session ID is not set, set the `user` and `session` locals to `null`.
	if (!sessionId) {
		locals.user = null;
		locals.session = null;
		return next();
	}

	// Validate the session
	const { session, user } = await lucia.validateSession(sessionId);

	// If the session is not found, create a blank session cookie and return early.
	if (!session || session === null) {
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return next();
	}

	// Check if the session is fresh
	const isSessionFresh = session.expiresAt.getTime() > new Date().getTime();
	session.fresh = isSessionFresh;

	// If the session is fresh, create a new session cookie and set it in the response.
	if (session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	// Set the `user` and `session` locals
	locals.user = user;
	locals.session = session;

	// if user is not logged in, redirect to login page or continue
	if (!locals.user) {
		return redirect(routes.portal.login);
	}

	// Continue to the next middleware
	return next();
};

/**
 * Middleware router that routes requests to different handlers based on the request path.
 */
export const onRequest = defineMiddlewareRouter(router);

export default onRequest;
