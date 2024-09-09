import type { AstroConfig, AstroIntegrationMiddleware, InjectedRoute } from 'astro';
import copy from 'rollup-plugin-copy';
import routeMap from '~lib/routeMap.ts';
import type { AstroFeedbackOptions } from '~schemas/index.ts';
import type { Branding, DeepPartial } from '~types/index.ts';
import { author } from '../package.json';

export const astroFeedbackAstroDBConfig = (
	name: string
): {
	configEntrypoint?: URL | string;
	seedEntrypoint?: URL | string;
} => {
	return { configEntrypoint: `${name}/db/config.ts` };
};

export const middlewareConfig = (name: string): AstroIntegrationMiddleware => {
	return {
		order: 'pre',
		entrypoint: `${name}/routes/middleware.ts`,
	};
};

export const namedRoutes = (name: string): Record<string, InjectedRoute> => {
	return {
		Index: {
			pattern: routeMap.base.index,
			entrypoint: `${name}/routes/index.astro`,
		},
		'Login Page': {
			pattern: routeMap.portal.login,
			entrypoint: `${name}/routes/portal/login.astro`,
		},
	};
};

export const astroFeedbackViteConfig = (name: string): DeepPartial<AstroConfig> => {
	return {
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
							src: `node_modules/${name}/routes/assets/public/*`,
							dest: 'public/',
						},
					],
				}),
			],
		},
	};
};

const branding: Branding = {
	SITE_TITLE: 'Astro Feedback Center',
	SITE_DESCRIPTION:
		'A feedback application built with Astro and AstroDB. It allows users to submit feedback from your projects and you can view them in the dashboard',
	AUTHOR: author,
	GITHUB: {
		REPO: 'https://github.com/matthiesenxyz/astro-feedback',
		LICENSE: 'https://github.com/MatthiesenXYZ/astro-feedback/blob/main/package/LICENSE.md',
	},
};

export const loggerLabel: string = branding.SITE_TITLE;

export const astroFeedbackVirtualModules = (
	name: string,
	o: {
		options: AstroFeedbackOptions;
	}
) => {
	const { options } = o;
	return {
		name,
		imports: {
			'astro-feedback:config': `export default ${JSON.stringify(options)}`,
			'astro-feedback:routes': `export default ${JSON.stringify(routeMap)}`,
			'astro-feedback:branding': `export default ${JSON.stringify(branding)}`,
		},
	};
};
