import type { LoggerOpts } from "@matthiesenxyz/integration-utils/astroUtils";
import type { AstroIntegrationLogger } from "astro";

/**
 * Returns the logger options for an info log level.
 *
 * @param {import("astro").AstroIntegrationLogger} logger - The logger to use.
 * @param {boolean} verbose - Whether to enable verbose logging.
 * @returns {import("@matthiesenxyz/integration-utils/astroUtils").LoggerOpts} The logger options for an info log level.
 */
function infoLoggerOpts(
	logger: AstroIntegrationLogger,
	verbose: boolean,
): LoggerOpts {
	return {
		logLevel: "info",
		logger,
		verbose,
	};
}

/**
 * Returns the logger options for a warn log level.
 *
 * @param {import("astro").AstroIntegrationLogger} logger - The logger to use.
 * @param {boolean} verbose - Whether to enable verbose logging.
 * @returns {import("@matthiesenxyz/integration-utils/astroUtils").LoggerOpts} The logger options for a warn log level.
 */
function warnLoggerOpts(
	logger: AstroIntegrationLogger,
	verbose: boolean,
): LoggerOpts {
	return {
		logLevel: "warn",
		logger,
		verbose,
	};
}

/**
 * Returns the logger options for an error log level.
 *
 * @param {import("astro").AstroIntegrationLogger} logger - The logger to use.
 * @returns {import("@matthiesenxyz/integration-utils/astroUtils").LoggerOpts} The logger options for an error log level.
 */
function errorLoggerOpts(logger: AstroIntegrationLogger): LoggerOpts {
	return {
		logLevel: "error",
		logger,
		verbose: true,
	};
}

export { infoLoggerOpts, warnLoggerOpts, errorLoggerOpts };
