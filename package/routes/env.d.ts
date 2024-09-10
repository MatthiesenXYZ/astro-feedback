/// <reference types="astro/client" />
/// <reference types="../../playground/.astro/types.d.ts" />

declare namespace App {
	interface Locals {
		user: import('lucia').User | null;
		session: import('lucia').Session | null;
	}
}

interface Window {
	theme: {
		setTheme: (theme: 'auto' | 'dark' | 'light') => void;
		getTheme: () => 'auto' | 'dark' | 'light';
		getSystemTheme: () => 'light' | 'dark';
		getDefaultTheme: () => 'auto' | 'dark' | 'light';
	};
}
