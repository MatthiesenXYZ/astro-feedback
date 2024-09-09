export type { RouteMap } from './routeMap.ts';
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? DeepPartial<U>[]
		: T[P] extends object | undefined
			? DeepPartial<T[P]>
			: T[P];
};

export type Branding = {
	SITE_TITLE: string;
	SITE_DESCRIPTION: string;
	AUTHOR: {
		email: string;
		name: string;
		url: string;
	};
	GITHUB: {
		REPO: string;
		LICENSE: string;
	};
};
