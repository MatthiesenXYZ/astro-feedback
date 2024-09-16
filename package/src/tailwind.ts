import type { Config } from 'tailwindcss';
import { fontFamily as _fontFamily } from 'tailwindcss/defaultTheme';

export const tailwindConfig: Config = {
	content: [
		'./node_modules/@matthiesenxyz/astro-feedback/routes/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter Variable', 'Inter', ..._fontFamily.sans],
			},
		},
	},
	plugins: [
		require('@matthiesenxyz/astro-feedback/twTextShadow'),
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('@tailwindcss/typography'),
		require('daisyui'),
	],
	daisyui: {
		themes: ['emerald', 'forest'],
		darkTheme: 'forest',
		logs: false,
	},
};

export default tailwindConfig;
