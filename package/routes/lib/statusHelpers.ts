import { type ui, useTranslations } from '../i18n';

export function convertStatusString(str: string, lang: keyof typeof ui): string {
	const t = useTranslations(lang, 'components/open-submission-status');

	switch (str) {
		case 'open':
			return t('open');
		case 'in-progress':
			return t('in-progress');
		case 'closed':
			return t('closed');
		case 'resolved':
			return t('resolved');
		default:
			return '';
	}
}

export function getSubmissionStatusColor(status: string): string | undefined {
	switch (status) {
		case 'open':
			return 'text-info';
		case 'in-progress':
			return 'text-warning';
		case 'closed':
			return 'text-error';
		case 'resolved':
			return 'text-success';
		default:
			return undefined;
	}
}
