import type { MiddlewareHandler } from "astro";

/**
 * Middleware Router Type.
 */
export type Router = Record<string, MiddlewareHandler>;
