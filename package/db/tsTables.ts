import { asDrizzleTable } from '@astrojs/db/utils';
import {
	AstroFeedbackAdmin,
	AstroFeedbackProject,
	AstroFeedbackSession,
	AstroFeedbackSubmission,
	AstroFeedbackTeam,
	AstroFeedbackUser,
} from './tables.ts';

/**
 * Astro Feedback User table. (Type-Safe)
 */
export const tsUser = asDrizzleTable('AstroFeedbackUser', AstroFeedbackUser);

/**
 * Astro Feedback Session table. (Type-Safe)
 */
export const tsSession = asDrizzleTable('AstroFeedbackSession', AstroFeedbackSession);

/**
 * Astro Feedback Admin table. (Type-Safe)
 */
export const tsAdmin = asDrizzleTable('AstroFeedbackAdmin', AstroFeedbackAdmin);

/**
 * Astro Feedback Team table. (Type-Safe)
 */
export const tsTeam = asDrizzleTable('AstroFeedbackTeam', AstroFeedbackTeam);

/**
 * Astro Feedback Project table. (Type-Safe)
 */
export const tsProject = asDrizzleTable('AstroFeedbackProject', AstroFeedbackProject);

/**
 * Astro Feedback Submission table. (Type-Safe)
 */
export const tsSubmission = asDrizzleTable('AstroFeedbackSubmission', AstroFeedbackSubmission);

export type TeamTableTyped =
	| {
			id: string;
			name: string;
			description: string;
			users: string[];
	  }
	| undefined;

export type PatchAPISubmissionType = {
	id: string;
	status: string;
	response: string;
};

export type SubmissionTableType = {
	projectId: string;
	subject: string;
	body: string;
	id?: string;
	email?: string | null;
	updatedAt?: Date | null;
	createdAt?: Date;
	userId?: string | null;
	status?: string;
	responses?: Array<{
		userId: string;
		body: string;
		createdAt: Date;
	}>;
};
