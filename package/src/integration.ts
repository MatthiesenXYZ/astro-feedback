import { addIntegration, addVirtualImports, defineIntegration } from 'astro-integration-kit';
import turnstile from 'astro-turnstile';
import { AstroFeedbackOptionsSchema as optionsSchema } from '~schemas/index.ts';
import {
	astroFeedbackAstroDBConfig,
	astroFeedbackVirtualModules,
	astroFeedbackViteConfig,
	loggerLabel,
	middlewareConfig,
	namedRoutes,
	optionalRoutes,
	turnstileOptions,
} from '~src/consts.ts';
import BrandingDTS from '~stubs/branding.ts';
import configDts from '~stubs/config.ts';
import RouteMapDTS from '~stubs/routemap.ts';
import type { AstroDBIntegrationParams } from '~types/astroHooks.ts';
import { name as packageName } from '../package.json';

/**
 * Astro Feedback integration.
 */
export const astroFeedback = defineIntegration({
	name: packageName,
	optionsSchema,
	setup({ name, options, options: { verbose, dashboardOnly } }) {
		return {
			hooks: {
				'astro:db:setup': ({ extendDb }: AstroDBIntegrationParams) => {
					// Add the Astro Feedback `@astrojs/db` Table Schema
					extendDb(astroFeedbackAstroDBConfig(name));
				},
				'astro:config:setup': async (params) => {
					// Destructure the Astro params
					const { logger, addMiddleware, injectRoute, injectScript, updateConfig } = params;

					const fL = logger.fork(loggerLabel);

					// Log a Setup message
					verbose && fL.info('Setting up...');

					// Add the Turnstile Integration
					addIntegration(params, {
						integration: turnstile(turnstileOptions(verbose)),
					});
					// Inject a custom script instead of `astro-turnstile`'s default script to avoid dependency conflicts
					injectScript(
						'page',
						'import "@matthiesenxyz/astro-feedback/modules/turnstile-client.js"'
					);

					// Update the Astro Config
					verbose && fL.info('Updating Astro Config...');
					updateConfig(astroFeedbackViteConfig(name));

					// Add virtual modules for Astro Feedback
					verbose && fL.info('Addming Virtual Modules...');
					addVirtualImports(params, astroFeedbackVirtualModules(name, { options }));

					// Add the Astro Feedback Middleware
					verbose && fL.info('Adding Middleware...');
					addMiddleware(middlewareConfig(name));

					// Inject the Astro Feedback Routes
					verbose && fL.info('injecting Routes...');

					// Inject the Optional Routes
					dashboardOnly &&
						verbose &&
						fL.info('Dashboard Only Mode Enabled! Skipping `/` and `/submit-feedback` routes.');

					if (!dashboardOnly) {
						const OptionalRoutes = optionalRoutes(name);
						for (const [name, route] of Object.entries(OptionalRoutes)) {
							verbose && fL.info(`Route Injected: ["${name}" - "${route.pattern}"]`);
							injectRoute(route);
						}
					}

					const routes = namedRoutes(name);
					for (const [name, route] of Object.entries(routes)) {
						verbose && fL.info(`Route Injected: ["${name}" - "${route.pattern}"]`);
						injectRoute(route);
					}

					// Log a Done message
					verbose && fL.info('Setup Done!');
				},
				'astro:config:done': ({ injectTypes, logger }) => {
					// Inject the Astro Feedback types
					const fL = logger.fork(loggerLabel);
					verbose && fL.info('Generating types...');
					injectTypes(configDts);
					injectTypes(RouteMapDTS);
					injectTypes(BrandingDTS);
				},
			},
		};
	},
});
