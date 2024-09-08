import { defineIntegration } from "astro-integration-kit";
import { AstroFeedbackOptionsSchema as optionsSchema } from "./schema.ts";
import { name } from "../package.json";
import { integrationLogger } from "@matthiesenxyz/integration-utils/astroUtils";
import { infoLoggerOpts } from "./lib/LoggerOpts.ts";

/**
 * Astro Feedback integration.
 */
export const integration = defineIntegration({
	name,
	optionsSchema,
	setup({ options: { verbose } }) {
		return {
			hooks: {
				"astro:config:setup": async (params) => {
					const { logger } = params;
					// Log a Setup message
					integrationLogger(infoLoggerOpts(logger, verbose), "Setting up...");
				},
			},
		};
	},
});
