/// <Reference types="@astrojs/db" />
import { defineDb } from "astro:db";
import {
	AstroFeedbackSession,
	AstroFeedbackUser,
	AstroFeedbackAdmin,
	AstroFeedbackProject,
	AstroFeedbackSubmission,
	AstroFeedbackTeam,
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
