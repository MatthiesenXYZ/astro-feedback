import db from '@astrojs/db';
import tailwind from '@astrojs/tailwind';
import { createResolver } from 'astro-integration-kit';
import { hmrIntegration } from 'astro-integration-kit/dev';
import { defineConfig } from 'astro/config';

const { default: astroFeedback } = await import('@matthiesenxyz/astro-feedback');

// https://astro.build/config
export default defineConfig({
	integrations: [
		db(),
		tailwind(),
		astroFeedback({ verbose: true }),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve('../package/dist'),
		}),
	],
});
