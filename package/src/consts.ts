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

export const optionalRoutes = (name: string): Record<string, InjectedRoute> => {
	return {
		//// Astro Pages (Public)
		'Public: Index': {
			pattern: routeMap.base.index,
			entrypoint: `${name}/routes/index.astro`,
			prerender: true,
		},
		'Public: Feedback Page': {
			pattern: routeMap.base.feedback,
			entrypoint: `${name}/routes/submit-feedback.astro`,
			prerender: true,
		},
	};
};

export const namedRoutes = (name: string): Record<string, InjectedRoute> => {
	return {
		//// Astro Pages (Portal)
		'Portal: Login Page': {
			pattern: routeMap.portal.login,
			entrypoint: `${name}/routes/portal/login.astro`,
			prerender: true,
		},
		'Portal: Logout': {
			pattern: routeMap.portal.logout,
			entrypoint: `${name}/routes/portal/logout.ts`,
			prerender: false,
		},
		'Portal: Index': {
			pattern: routeMap.portal.index,
			entrypoint: `${name}/routes/portal/index.astro`,
			prerender: false,
		},
		// 'Portal: Projects Index': {},
		// 'Portal: New Project': {},
		// 'Portal: Edit Project': {},
		// 'Portal: View Project': {},
		// 'Portal: Submissions Index': {},
		// 'Portal: New Submission': {},
		// 'Portal: View Submission': {},
		// 'Portal: Teams Index': {},
		// 'Portal: New Team': {},
		// 'Portal: Edit Team': {},
		// 'Portal: View Team': {},
		// 'Portal: Users Index': {},
		// 'Portal: Edit User': {},
		// 'Portal: View User': {},
		//// Astro API Routes
		'API: GitHub Login': {
			pattern: routeMap.api.login,
			entrypoint: `${name}/routes/api/login.ts`,
			prerender: false,
		},
		'API: GitHub Callback': {
			pattern: routeMap.api.callback,
			entrypoint: `${name}/routes/api/callback.ts`,
			prerender: false,
		},
		'API: Logout': {
			pattern: routeMap.api.logout,
			entrypoint: `${name}/routes/api/logout.ts`,
			prerender: false,
		},
		'API: Mailer': {
			pattern: routeMap.api.mailer,
			entrypoint: `${name}/routes/api/mailer.ts`,
			prerender: false,
		},
		'API: Project': {
			pattern: routeMap.api.projects,
			entrypoint: `${name}/routes/api/project.ts`,
			prerender: false,
		},
		'API: Submission': {
			pattern: routeMap.api.submissions,
			entrypoint: `${name}/routes/api/submission.ts`,
			prerender: false,
		},
		'API: Team': {
			pattern: routeMap.api.teams,
			entrypoint: `${name}/routes/api/team.ts`,
			prerender: false,
		},
		'API: User': {
			pattern: routeMap.api.users,
			entrypoint: `${name}/routes/api/user.ts`,
			prerender: false,
		},
	};
};

export const astroFeedbackViteConfig = (name: string): DeepPartial<AstroConfig> => {
	return {
		security: {
			checkOrigin: true,
		},
		experimental: {
			serverIslands: true,
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
					MAILER_API_CRYPTO_KEY: envField.string({
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
