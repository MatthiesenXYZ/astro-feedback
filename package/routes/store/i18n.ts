import { type ComponentsJSON, browser, createI18n, formatter, localeFrom } from '@nanostores/i18n';
import { persistentAtom } from '@nanostores/persistent';
import esJSON from './translations/es.json';

const available = ['en', 'es'];

export type Language = (typeof available)[number];

const localeMap: Record<Language, ComponentsJSON> = {
	es: esJSON,
};

export const $localeSettings = persistentAtom<string | undefined>('locale', undefined);

export const $locale = localeFrom(
	$localeSettings, // User’s locale from localStorage
	browser({
		// or browser’s locale auto-detect
		available,
		fallback: 'en',
	})
);

export const format = formatter($locale);

export const $i18n = createI18n($locale, {
	baseLocale: 'en',
	get: async (code: Language) => {
		return localeMap[code] as ComponentsJSON;
	},
});

/**
 * Update the UI string with the given id to the given value
 */
export function updateUiString(o: { element: string; translation: string }) {
	const el = document.getElementById(o.element);
	if (el) el.textContent = o.translation;
}

/**
 * Update the UI strings with the given id to the given value
 */
export function updateUiStringsMutipleById(o: { element: string; translation: string }) {
	const els = document.querySelectorAll(`#${o.element}`);
	for (const el of els) {
		if (el) el.textContent = o.translation;
	}
}
