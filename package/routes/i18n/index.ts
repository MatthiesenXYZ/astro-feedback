export { default as LanguageSelector } from './LanguageSelector.astro';

// --- i18n Config --- //

// Import translations from JSON files
import englishUS from './translations/en-us.json';
import espanol from './translations/es.json';

// Translations
export const ui = {
	en: englishUS,
	es: espanol,
} as const;

// Language Display Names - Must match the keys in the `ui` object above
export const languages = {
	en: 'English (en-US)',
	es: 'Español (es)',
};

// Default language - Must match one of the keys in the `ui` object above
export const defaultLang = 'en';

// Show the default language in the URL (e.g. /en/page) or hide it (e.g. /page)
export const showDefaultLang = false;

// --- i18n Utils --- //

// Example of how to use the i18n utils on a Static page
// export async function getStaticPaths() {
//     return [
//         { params: { lang: undefined } },
//         { params: { lang: 'en' } },
//         { params: { lang: 'es' } },
//         ...Other Languages
//     ];
// }

// Get the current language from the URL
export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang && lang in ui) return lang as keyof typeof ui;
	return defaultLang;
}

// Get the Tranlsation function for a specific component
export function useTranslations(
	lang: keyof typeof ui,
	comp: keyof (typeof ui)[typeof defaultLang]
) {
	return function t(key: string): string {
		// @ts-ignore
		return ui[lang][comp][key] || ui[defaultLang][comp][key];
	};
}

// Get the Translated Path for a specific language
export function useTranslatedPath(lang: keyof typeof ui) {
	return function translatePath(path: string, l: string = lang) {
		return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
	};
}
