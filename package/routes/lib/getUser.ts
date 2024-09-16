import { db, eq } from 'astro:db';
import type { AstroGlobal } from 'astro';
import { tsUser } from '../../db/tsTables';
import { lucia } from './auth';

export const getUser = async (Astro: AstroGlobal) => {
	// Break out the Astro Global
	const { cookies, locals } = Astro;

	// get the cookies information
	const authSessionCookie = cookies.get(lucia.sessionCookieName);

	// if the user session is not set, check if the auth session cookie is set
	if (locals.session === null || locals.session === undefined) {
		if (authSessionCookie === undefined) {
			// if the auth session cookie is not set, return early
			return { isLoggedIn: false, user: undefined };
		}

		// Validate the user session
		const { session, user } = await lucia.validateSession(authSessionCookie.value);

		// if the user session is not set, return early
		if (session === null) {
			return { isLoggedIn: false, user: undefined };
		}

		// if the user session is expired, return early
		if (session.expiresAt < new Date()) {
			await lucia.invalidateSession(session.id);

			cookies.delete(lucia.sessionCookieName);
			cookies.delete('github_oauth_state');

			const blankSessionCookie = lucia.createBlankSessionCookie();

			cookies.set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);

			Astro.locals.session = null;
			Astro.locals.user = null;
			return { isLoggedIn: false, user: undefined };
		}

		// Set the user and session locals
		const userData = await db.select().from(tsUser).where(eq(tsUser.id, user.id)).get();

		// Return the user's data
		return {
			isLoggedIn: true,
			user: userData,
		};
	}

	// if locals is available, process the user session
	const { session, user } = await lucia.validateSession(locals.session.id);

	// if the user session is not set, return early
	if (session === null) {
		return { isLoggedIn: false, user: undefined };
	}

	// if the user session is expired, return early
	if (session.expiresAt < new Date()) {
		await lucia.invalidateSession(session.id);

		cookies.delete(lucia.sessionCookieName);
		cookies.delete('github_oauth_state');

		const blankSessionCookie = lucia.createBlankSessionCookie();

		cookies.set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);

		Astro.locals.session = null;
		Astro.locals.user = null;
		return { isLoggedIn: false, user: undefined };
	}

	// Get the user's data from the database
	const userData = await db.select().from(tsUser).where(eq(tsUser.id, user.id)).get();

	// Return the user's data
	return {
		isLoggedIn: true,
		user: userData,
	};
};

export default getUser;
