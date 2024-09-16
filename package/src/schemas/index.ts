import { z } from 'astro/zod';

export const HeadConfigSchema = () =>
	z
		.array(
			z.object({
				/** Name of the HTML tag to add to `<head>`, e.g. `'meta'`, `'link'`, or `'script'`. */
				tag: z.enum(['title', 'base', 'link', 'style', 'meta', 'script', 'noscript', 'template']),
				/** Attributes to set on the tag, e.g. `{ rel: 'stylesheet', href: '/custom.css' }`. */
				attrs: z.record(z.union([z.string(), z.boolean(), z.undefined()])).default({}),
				/** Content to place inside the tag (optional). */
				content: z.string().default(''),
			})
		)
		.default([]);

/**
 * Astro Feedback options zod schema.
 */
export const AstroFeedbackOptionsSchema = z
	.object({
		/**
		 * Whether to enable verbose logging.
		 */
		verbose: z.boolean().optional().default(false),
		/**
		 * Custom HTML head configuration
		 * @default []
		 */
		headers: HeadConfigSchema(),
		/**
		 * Access-Control-Allow-Origin header value(s) for the Submission system.
		 *
		 * If empty, the header will not be set and the Submission system will not be accessible from other domains.
		 * @default []
		 * @example ['https://example.com', 'https://example.org']
		 */
		accessControlAllowOrigin: z.array(z.string()).optional().default([]),
	})
	.optional()
	.default({});

/**
 * Astro Feedback options.
 */
export type AstroFeedbackOptions = z.infer<typeof AstroFeedbackOptionsSchema>;
