import type { AstroIntegrationMiddleware } from "astro";

export const dbConfigEntrypoint: string =
	"@matthiesenxyz/astro-feedback/db/config.ts";

export const middlewareConfig: AstroIntegrationMiddleware = {
	order: "pre",
	entrypoint: "@matthiesenxyz/astro-feedback/routes/middleware.ts",
};
