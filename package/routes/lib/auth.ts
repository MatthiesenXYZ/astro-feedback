import { db } from 'astro:db';
import { Lucia, TimeSpan } from 'lucia';
import { AstroDBAdapter } from 'lucia-adapter-astrodb';
import { tsSession, tsUser } from '../../db/tsTables.ts';

const astroDB = new AstroDBAdapter(db, tsSession, tsUser);

export const lucia = new Lucia(astroDB, {
	sessionExpiresIn: new TimeSpan(2, 'w'),
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.github_id,
			username: attributes.username,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	github_id: number;
	username: string;
}
