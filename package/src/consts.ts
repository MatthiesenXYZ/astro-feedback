import type { AstroConfig, AstroIntegrationMiddleware, InjectedRoute } from 'astro';
import { envField } from 'astro/config';
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
		// Astro Pages (Public)
		'Public: Index': {
			pattern: routeMap.base.index,
			entrypoint: `${name}/routes/index.astro`,
		},
		'Public: Feedback Page': {
			pattern: routeMap.base.feedback,
			entrypoint: `${name}/routes/submit-feedback.astro`,
		},
		// Astro Pages (Portal)
		'Portal: Login Page': {
			pattern: routeMap.portal.login,
			entrypoint: `${name}/routes/portal/login.astro`,
		},
		'Portal: Logout': {
			pattern: routeMap.portal.logout,
			entrypoint: `${name}/routes/portal/logout.ts`,
		},
		// Astro API Routes
		'API: GitHub Login': {
			pattern: routeMap.api.login,
			entrypoint: `${name}/routes/api/login.ts`,
		},
		'API: GitHub Callback': {
			pattern: routeMap.api.callback,
			entrypoint: `${name}/routes/api/callback.ts`,
		},
		'API: Logout': {
			pattern: routeMap.api.logout,
			entrypoint: `${name}/routes/api/logout.ts`,
		},
	};
};

export const astroFeedbackViteConfig = (name: string): DeepPartial<AstroConfig> => {
	return {
		security: {
			checkOrigin: true,
		},
		experimental: {
			env: {
				schema: {
					GITHUB_CLIENT_ID: envField.string({
						context: 'server',
						access: 'secret',
						optional: false,
					}),
					GITHUB_CLIENT_SECRET: envField.string({
						context: 'server',
						access: 'secret',
						optional: false,
					}),
				},
			},
		},
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
		'Built using Astro and AstroDB. Effortlessly collect feedback on your projects, then monitor and manage submissions through a streamlined dashboard. Stay connected to your users and improve your work with real-time feedback.',
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
