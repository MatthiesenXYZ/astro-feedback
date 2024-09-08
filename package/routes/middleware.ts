import { verifyRequestOrigin } from "lucia";
import { lucia } from "./lib/auth.ts";
import { defineMiddlewareRouter } from "./lib/middlewareRouter.ts";
import type { Router } from "./lib/types.ts";

// Define a middleware router that routes requests to different handlers based on the request path.
const router: Router = {
	// Route all requests to the root path to set the `user` and `session` locals.
	"/**": async (context, next) => {
		if (context.request.method !== "GET") {
			const originHeader = context.request.headers.get("Origin");
			const hostHeader = context.request.headers.get("Host");
			if (
				!originHeader ||
				!hostHeader ||
				!verifyRequestOrigin(originHeader, [hostHeader])
			) {
				return new Response(null, {
					status: 403,
				});
			}
		}
		const sessionId =
			context.cookies.get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			context.locals.user = null;
			context.locals.session = null;
			return next();
		}

		const { session, user } = await lucia.validateSession(sessionId);
		if (session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			context.cookies.set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			context.cookies.set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}
		context.locals.user = user;
		context.locals.session = session;
		return next();
	},
	// Route all requests to the `/portal` path and check if the user is authenticated.
	"/portal/**": async (context, next) => {
		if (!context.locals.user) {
			return context.redirect("/login");
		}
		return next();
	},
};

/**
 * Middleware router that routes requests to different handlers based on the request path.
 */
const middlewareRouter = defineMiddlewareRouter(router);

export default middlewareRouter;
