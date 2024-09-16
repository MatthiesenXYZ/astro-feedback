import type { MiddlewareHandler } from 'astro';

/**
 * Middleware Router Type.
 */
export type Router = Record<string, MiddlewareHandler>;

// Define the Team type because 'users' is of type unknown in the database
/**
 * Team table response type for a single team.
 */
export type Team = {
	id: string;
	name: string;
	description: string;
	users: string[];
};
