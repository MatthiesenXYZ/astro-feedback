import { db, eq } from 'astro:db';
import type { AstroGlobal } from 'astro';
import {
	type TeamTableTyped,
	tsAdmin,
	tsProject,
	tsSubmission,
	tsTeam,
	type tsUser,
} from '../../db/tsTables';
import getUser from './getUser';

type UserMetadata = {
	userData: typeof tsUser.$inferSelect | undefined;
	userAvatar: string;
	matchedProjects: (typeof tsProject.$inferSelect)[];
	matchedSubmissions: (typeof tsSubmission.$inferSelect)[];
	matchedTeams: TeamTableTyped[];
	allUserSubmissions: (typeof tsSubmission.$inferSelect)[];
	isLoggedIn: boolean;
	isAdmin: boolean;
};

export async function getUserMetadata(Astro: AstroGlobal): Promise<UserMetadata> {
	let userAvatar = 'https://www.gravatar.com/avatar/?d=retro';
	const matchedTeams: TeamTableTyped[] = [];
	const matchedProjects: (typeof tsProject.$inferSelect)[] = [];
	const matchedSubmissions: (typeof tsSubmission.$inferSelect)[] = [];
	const allUserSubmissions: (typeof tsSubmission.$inferSelect)[] = [];
	let isAdmin = false;

	const { user, isLoggedIn } = await getUser(Astro);

	if (!user) {
		return {
			userAvatar,
			matchedProjects,
			matchedSubmissions,
			allUserSubmissions,
			matchedTeams,
			isAdmin,
			isLoggedIn,
			userData: user,
		};
	}

	if (user.avatar) {
		userAvatar = user.avatar;
	}

	const existingTeams = (await db.select().from(tsTeam)) as TeamTableTyped[];

	for (const team of existingTeams) {
		if (team && Array.from(team.users).includes(user.id)) {
			matchedTeams.push(team);
		}
	}

	const existingProjects = await db.select().from(tsProject);

	if (matchedTeams.length > 0) {
		for (const team of matchedTeams) {
			team &&
				existingProjects.find((project) => {
					if (project && project.teamId === team.id) {
						matchedProjects.push(project);
					}
				});
		}
	}

	const existingSubmissions = await db
		.select()
		.from(tsSubmission)
		.where(eq(tsSubmission.status, 'open'));

	if (matchedProjects.length > 0) {
		for (const project of matchedProjects) {
			existingSubmissions.find((submission) => {
				if (submission && submission.projectId === project.id) {
					matchedSubmissions.push(submission);
				}
			});
		}
	}

	const existingAdminCheck = await db
		.select()
		.from(tsAdmin)
		.where(eq(tsAdmin.userId, user.id))
		.get();

	if (existingAdminCheck) {
		isAdmin = true;
	}

	const userSubmissions = await db
		.select()
		.from(tsSubmission)
		.where(eq(tsSubmission.userId, user.id));

	if (userSubmissions.length > 0) {
		allUserSubmissions.push(...userSubmissions);
	}

	return {
		userAvatar,
		matchedProjects,
		matchedSubmissions,
		allUserSubmissions,
		matchedTeams,
		isAdmin,
		isLoggedIn,
		userData: user,
	};
}
