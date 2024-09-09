import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { addVirtualImports, defineIntegration } from 'astro-integration-kit';
import copy from 'rollup-plugin-copy';
import { infoLoggerOpts } from '~lib/LoggerOpts.ts';
import { AstroFeedbackOptionsSchema as optionsSchema } from '~schemas/index.ts';
import { dbConfigEntrypoint, middlewareConfig } from '~src/consts.ts';
import configDts from '~stubs/config.ts';
import type { AstroDBIntegrationParams } from '~types/astroHooks.ts';
import { name } from '../package.json';

/**
 * Astro Feedback integration.
 */
export const astroFeedback = defineIntegration({
	name,
	optionsSchema,
	setup({ name, options, options: { verbose } }) {
		return {
			hooks: {
				'astro:db:setup': ({ extendDb }: AstroDBIntegrationParams) => {
					// Add the Astro Feedback `@astrojs/db` Table Schema
					extendDb({
						configEntrypoint: dbConfigEntrypoint,
					});
				},
				'astro:config:setup': async (params) => {
					// Destructure the Astro params
					const { logger, addMiddleware, injectRoute, updateConfig } = params;

					// Log a Setup message
					integrationLogger(infoLoggerOpts(logger, verbose), 'Setting up...');

					// Add the Astro Feedback Middleware
					addMiddleware(middlewareConfig);

					// Add virtual modules for Astro Feedback
					addVirtualImports(params, {
						name,
						imports: {
							'astro-feedback:config': `export default ${JSON.stringify(options)}`,
						},
					});

					// Update the Astro Config
					updateConfig({
						vite: {
							optimizeDeps: {
								exclude: ['astro:db'],
							},
							plugins: [
								copy({
									copyOnce: true,
									hook: 'buildStart',
									targets: [
										{
											src: 'node_modules/@matthiesenxyz/astro-feedback/routes/assets/public/*',
											dest: 'public/',
										},
									],
								}),
							],
						},
					});

					// Inject Pages
					injectRoute({
						pattern: '/',
						entrypoint: '@matthiesenxyz/astro-feedback/routes/index.astro',
					});
				},
				'astro:config:done': ({ injectTypes }) => {
					// Inject the Astro Feedback types
					injectTypes(configDts);
				},
			},
		};
	},
});
