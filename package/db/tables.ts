/// <Reference types="@astrojs/db" />
import { NOW, column, defineTable } from 'astro:db';

/**
 * Astro Feedback User table.
 */
export const AstroFeedbackUser = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		url: column.text({ optional: true }),
		name: column.text(),
		email: column.text({ unique: true, optional: true }),
		avatar: column.text({ optional: true }),
		githubId: column.number({ unique: true }),
		username: column.text(),
		updatedAt: column.date({ default: NOW, optional: true }),
		createdAt: column.date({ default: NOW, optional: true }),
	},
});

/**
 * Astro Feedback Session table.
 */
export const AstroFeedbackSession = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		expiresAt: column.date(),
		userId: column.text({
			references: () => AstroFeedbackUser.columns.id,
			optional: false,
		}),
	},
});

/**
 * Astro Feedback Admin table.
 */
export const AstroFeedbackAdmin = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		userId: column.text({ references: () => AstroFeedbackUser.columns.id }),
	},
});

/**
 * Astro Feedback Team table.
 */
export const AstroFeedbackTeam = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		name: column.text(),
		description: column.text(),
		users: column.json({ default: [] }),
	},
});

/**
 * Astro Feedback Project table.
 */
export const AstroFeedbackProject = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		title: column.text(),
		description: column.text(),
		teamId: column.text({ references: () => AstroFeedbackTeam.columns.id }),
		owner: column.text({ references: () => AstroFeedbackAdmin.columns.id }),
		createdAt: column.date({ default: NOW }),
		submissionsOpen: column.boolean({ default: true }),
		defaultProject: column.boolean({ default: false }),
	},
});

/**
 * Astro Feedback Submission table.
 */
export const AstroFeedbackSubmission = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		projectId: column.text({
			references: () => AstroFeedbackProject.columns.id,
		}),
		// User who submitted the feedback
		userId: column.text({
			references: () => AstroFeedbackUser.columns.id,
			optional: true,
		}),
		email: column.text({ optional: true }),
		// Feedback status
		status: column.text({ default: 'open' }),
		createdAt: column.date({ default: NOW }),
		updatedAt: column.date({ default: NOW, optional: true }),
		// Feedback content
		subject: column.text(),
		body: column.text({ multiline: true }),
		responses: column.json({ default: [], optional: true }),
	},
});
