import db from '@astrojs/db';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import { createResolver } from 'astro-integration-kit';
import { hmrIntegration } from 'astro-integration-kit/dev';
import { defineConfig } from 'astro/config';

const { default: astroFeedback } = await import('@matthiesenxyz/astro-feedback');

// https://astro.build/config
export default defineConfig({
	site: 'http://localhost:4321',
	output: 'hybrid',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		db(),
		tailwind(),
		astroFeedback({ verbose: true }),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve('../package/dist'),
		}),
	],
});
