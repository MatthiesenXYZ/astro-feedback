import { addVirtualImports, defineIntegration } from 'astro-integration-kit';
import { AstroFeedbackOptionsSchema as optionsSchema } from '~schemas/index.ts';
import {
	astroFeedbackAstroDBConfig,
	astroFeedbackVirtualModules,
	astroFeedbackViteConfig,
	loggerLabel,
	middlewareConfig,
	namedRoutes,
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
	setup({ name, options, options: { verbose } }) {
		return {
			hooks: {
				'astro:db:setup': ({ extendDb }: AstroDBIntegrationParams) => {
					// Add the Astro Feedback `@astrojs/db` Table Schema
					extendDb(astroFeedbackAstroDBConfig(name));
				},
				'astro:config:setup': async (params) => {
					// Destructure the Astro params
					const { logger, addMiddleware, injectRoute, updateConfig } = params;

					const fL = logger.fork(loggerLabel);

					// Log a Setup message
					verbose && fL.info('Setting up...');

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
