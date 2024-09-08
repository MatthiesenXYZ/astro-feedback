import type { MiddlewareHandler } from "astro";
import { defineMiddleware, sequence } from "astro/middleware";
import micromatch from "micromatch";
import type { Router } from "../lib/types.ts";

/**
 * Define a middleware router that routes requests to different handlers based on the request path.
 *
 * @example
 * ```ts
 * const router: Router = {};
 * router["/"] = (context, next) => {};
 * router["/about"] = (context, next) => {};
 * export const onRequest = defineMiddlewareRouter(router);
 * ```
 */
export function defineMiddlewareRouter(router: Router): MiddlewareHandler {
	const entries = Object.entries(router);
	return defineMiddleware((context, next) => {
		return sequence(
			...entries
				.filter(([path]) => micromatch.isMatch(context.url.pathname, path))
				.map(([_, handler]) => handler),
		)(context, next);
	});
}
