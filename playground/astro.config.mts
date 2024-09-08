import { defineConfig } from "astro/config";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import db from "@astrojs/db";

const { default: astroFeedback } = await import(
	"@matthiesenxyz/astro-feedback"
);

// https://astro.build/config
export default defineConfig({
	integrations: [
		db(),
		astroFeedback({ verbose: true }),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
});
