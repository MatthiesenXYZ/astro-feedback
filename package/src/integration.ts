import { defineIntegration } from "astro-integration-kit";
import { AstroFeedbackOptionsSchema as optionsSchema } from "~schemas/index.ts";
import { name } from "../package.json";
import { integrationLogger } from "@matthiesenxyz/integration-utils/astroUtils";
import { infoLoggerOpts } from "~lib/LoggerOpts.ts";
import type { AstroDBIntegrationParams } from "~types/index.ts";
import { dbConfigEntrypoint, middlewareConfig } from "./consts.ts";

/**
 * Astro Feedback integration.
 */
export const astroFeedback = defineIntegration({
	name,
	optionsSchema,
	setup({ options: { verbose } }) {
		return {
			hooks: {
				"astro:db:setup": ({ extendDb }: AstroDBIntegrationParams) => {
					// Add the Astro Feedback `@astrojs/db` Table Schema
					extendDb({
						configEntrypoint: dbConfigEntrypoint,
					});
				},
				"astro:config:setup": async (params) => {
					// Destructure the Astro params
					const { logger, addMiddleware } = params;

					// Log a Setup message
					integrationLogger(infoLoggerOpts(logger, verbose), "Setting up...");

					// Add the Astro Feedback Middleware
					addMiddleware(middlewareConfig);
				},
			},
		};
	},
});
