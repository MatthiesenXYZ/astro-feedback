import { z } from "astro/zod";

/**
 * Astro Feedback options zod schema.
 */
export const AstroFeedbackOptionsSchema = z
	.object({
		/**
		 * Whether to enable verbose logging.
		 */
		verbose: z.boolean().optional().default(false),
	})
	.optional()
	.default({});

/**
 * Astro Feedback options.
 */
export type AstroFeedbackOptions = z.infer<typeof AstroFeedbackOptionsSchema>;
