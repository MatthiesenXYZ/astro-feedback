import type { HTMLAttributes } from 'astro/types';

export type twFontWeight =
	| 'font-thin'
	| 'font-extralight'
	| 'font-light'
	| 'font-normal'
	| 'font-medium'
	| 'font-semibold'
	| 'font-bold'
	| 'font-extrabold'
	| 'font-black';

export type FontWeight =
	| 'thin'
	| 'extralight'
	| 'light'
	| 'normal'
	| 'medium'
	| 'semibold'
	| 'bold'
	| 'extrabold'
	| 'black';

export type Variant =
	| 'primary'
	| 'secondary'
	| 'accent'
	| 'base'
	| 'success'
	| 'warning'
	| 'error'
	| 'info';

export type twVariant =
	| 'text-primary'
	| 'text-secondary'
	| 'text-accent'
	| 'text-base'
	| 'text-success'
	| 'text-warning'
	| 'text-error'
	| 'text-info';

export interface twSpanProps extends HTMLAttributes<'span'> {
	variant?: Variant;
	fontWeight?: FontWeight;
}
export interface twH1Props extends HTMLAttributes<'h1'> {
	variant?: Variant;
	fontWeight?: FontWeight;
}
export interface twH2Props extends HTMLAttributes<'h2'> {
	variant?: Variant;
	fontWeight?: FontWeight;
}
export interface twH3Props extends HTMLAttributes<'h3'> {
	variant?: Variant;
	fontWeight?: FontWeight;
}

export const twFontWeightMap: Record<FontWeight, twFontWeight> = {
	thin: 'font-thin',
	extralight: 'font-extralight',
	light: 'font-light',
	normal: 'font-normal',
	medium: 'font-medium',
	semibold: 'font-semibold',
	bold: 'font-bold',
	extrabold: 'font-extrabold',
	black: 'font-black',
};

export const twTextVariantMap: Record<Variant, twVariant> = {
	primary: 'text-primary',
	secondary: 'text-secondary',
	accent: 'text-accent',
	base: 'text-base',
	success: 'text-success',
	warning: 'text-warning',
	error: 'text-error',
	info: 'text-info',
};
