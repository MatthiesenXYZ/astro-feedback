import { asDrizzleTable } from "@astrojs/db/utils";
import {
	AstroFeedbackAdmin,
	AstroFeedbackProject,
	AstroFeedbackSession,
	AstroFeedbackSubmission,
	AstroFeedbackTeam,
	AstroFeedbackUser,
} from "./tables.ts";

/**
 * Astro Feedback User table. (Type-Safe)
 */
export const tsUser = asDrizzleTable("AstroFeedbackUser", AstroFeedbackUser);

/**
 * Astro Feedback Session table. (Type-Safe)
 */
export const tsSession = asDrizzleTable(
	"AstroFeedbackSession",
	AstroFeedbackSession,
);

/**
 * Astro Feedback Admin table. (Type-Safe)
 */
export const tsAdmin = asDrizzleTable("AstroFeedbackAdmin", AstroFeedbackAdmin);

/**
 * Astro Feedback Team table. (Type-Safe)
 */
export const tsTeam = asDrizzleTable("AstroFeedbackTeam", AstroFeedbackTeam);

/**
 * Astro Feedback Project table. (Type-Safe)
 */
export const tsProject = asDrizzleTable(
	"AstroFeedbackProject",
	AstroFeedbackProject,
);

/**
 * Astro Feedback Submission table. (Type-Safe)
 */
export const tsSubmission = asDrizzleTable(
	"AstroFeedbackSubmission",
	AstroFeedbackSubmission,
);
