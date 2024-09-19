import { defaultLang, showDefaultLang, ui } from './ui';

// Example of how to use the i18n utils on a Static page
// export async function getStaticPaths() {
//     return [
//         { params: { lang: undefined } },
//         { params: { lang: 'en' } },
//         { params: { lang: 'es' } },
//     ];
// }

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang && lang in ui) return lang as keyof typeof ui;
	return defaultLang;
}

export function useTranslations(
	lang: keyof typeof ui,
	comp: keyof (typeof ui)[typeof defaultLang]
) {
	return function t(key: string): string {
		// @ts-ignore
		return ui[lang][comp][key] || ui[defaultLang][comp][key];
	};
}

export function useTranslatedPath(lang: keyof typeof ui) {
	return function translatePath(path: string, l: string = lang) {
		return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
	};
}
