import { db, eq } from 'astro:db';
import { tsUser } from '../../db/tsTables';

export const getUser = async ({ user }: App.Locals) => {
	// If the user is not logged in, return early
	if (!(user !== null && user !== undefined)) {
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
