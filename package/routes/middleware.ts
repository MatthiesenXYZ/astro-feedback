import { verifyRequestOrigin } from 'lucia';
import { lucia } from './lib/auth.ts';
import { defineMiddlewareRouter } from './lib/middlewareRouter.ts';
import type { Router } from './lib/types.ts';

// Define a middleware router that routes requests to different handlers based on the request path.
const router: Router = {};

// Route all requests to the root path to set the `user` and `session` locals.
router['/**'] = async ({ request, cookies, locals }, next) => {
	// If the request method is not `GET`, check if the request origin is allowed.
	if (request.method !== 'GET') {
		const originHeader = request.headers.get('Origin');
		const hostHeader = request.headers.get('Host');
		if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
			return new Response(null, {
				status: 403,
			});
		}
	}
	const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) {
		locals.user = null;
		locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (!session || session === null) {
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return next();
	}

	const isSessionFresh = session.expiresAt.getTime() > new Date().getTime();
	session.fresh = isSessionFresh;

	if (session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	locals.user = user;
	locals.session = session;
	return next();
};

// Route all requests to the `/portal` path and check if the user is authenticated.
router['/portal/!(login)**'] = async ({ locals, redirect }, next) => {
	if (!locals.user) {
		return redirect('/portal/login');
	}
	return next();
};

/**
 * Middleware router that routes requests to different handlers based on the request path.
 */
export const onRequest = defineMiddlewareRouter(router);

export default onRequest;
