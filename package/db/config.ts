/// <Reference types="@astrojs/db" />
import { defineDb } from "astro:db";
import {
	AstroFeedbackAdmin,
	AstroFeedbackProject,
	AstroFeedbackSession,
	AstroFeedbackSubmission,
	AstroFeedbackTeam,
	AstroFeedbackUser,
} from "./tables.ts";

export default defineDb({
	tables: {
		AstroFeedbackUser,
		AstroFeedbackSession,
		AstroFeedbackAdmin,
		AstroFeedbackProject,
		AstroFeedbackSubmission,
		AstroFeedbackTeam,
	},
});
