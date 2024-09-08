/**
 * Hook type for `"astro:db:setup"` Astro Integration hook provided by `@astrojs/db`.
 */
export type AstroDBIntegrationParams = {
	extendDb: (options: {
		configEntrypoint?: URL | string;
		seedEntrypoint?: URL | string;
	}) => void;
};
