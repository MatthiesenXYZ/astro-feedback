export function convertStatusString(str: string): string {
	return str
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
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
