import routes from 'astro-feedback:routes';
import type { AstroGlobal } from 'astro';
import { getUserMetadata } from './GetMeta';
import getUser from './getUser';

export async function validateUser(
	Astro: AstroGlobal,
	level?: 'user' | 'admin' | 'teammember',
	teamId?: string
) {
	const { isLoggedIn } = await getUser(Astro);

	if (!isLoggedIn) {
		return Astro.redirect(routes.base.index);
	}

	const userMetadata = await getUserMetadata(Astro);

	switch (level) {
		case 'user': {
			return undefined;
		}
		case 'teammember': {
			if (!teamId) {
				return Astro.redirect(routes.portal.index);
			}
			const team = userMetadata.matchedTeams.find((team) => {
				if (team && team.id === teamId) {
					return true;
				}
				return false;
			});
			if (!team) {
				return Astro.redirect(routes.portal.index);
			}
			return undefined;
		}
		case 'admin': {
			if (!userMetadata.isAdmin) {
				return Astro.redirect(routes.portal.index);
			}
			return undefined;
		}
		case undefined: {
			return undefined;
		}
	}
}
