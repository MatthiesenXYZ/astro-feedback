import { fontFamily as _fontFamily } from 'tailwindcss/defaultTheme';

export default {
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
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: ['emerald', 'forest'],
		darkTheme: 'forest',
		logs: false,
	},
};
