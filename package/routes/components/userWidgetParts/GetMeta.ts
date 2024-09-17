import { db, eq } from 'astro:db';
import {
	type TeamTableTyped,
	tsProject,
	tsSubmission,
	tsTeam,
	type tsUser,
} from '../../../db/tsTables';

type UserMetadata = {
	userAvatar: string;
	matchedProjects: (typeof tsProject.$inferSelect)[];
	matchedSubmissions: (typeof tsSubmission.$inferSelect)[];
	matchedTeams: TeamTableTyped[];
};

export async function getUserMetadata(
	user: typeof tsUser.$inferSelect | undefined
): Promise<UserMetadata> {
	let userAvatar = 'https://www.gravatar.com/avatar/?d=retro';
	const matchedTeams: TeamTableTyped[] = [];
	const matchedProjects: (typeof tsProject.$inferSelect)[] = [];
	const matchedSubmissions: (typeof tsSubmission.$inferSelect)[] = [];

	if (!user) {
		return {
			userAvatar,
			matchedProjects,
			matchedSubmissions,
			matchedTeams,
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
			existingProjects.find((project) => {
				if (project && project.teamId === team?.id) {
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

	return {
		userAvatar,
		matchedProjects,
		matchedSubmissions,
		matchedTeams,
	};
}
