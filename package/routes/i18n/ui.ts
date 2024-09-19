import english from './translations/en.json';
import espanol from './translations/es.json';

export const languages = {
	en: 'English',
	es: 'Español',
};

export const defaultLang = 'en';
export const showDefaultLang = false;

export const ui = {
	en: english,
	es: espanol,
} as const;
