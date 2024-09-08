# `@matthiesenxyz/astro-feedback`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that TODO:description

## Usage

### Prerequisites

TODO:

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add @matthiesenxyz/astro-feedback
```

```bash
npx astro add @matthiesenxyz/astro-feedback
```

```bash
yarn astro add @matthiesenxyz/astro-feedback
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add @matthiesenxyz/astro-feedback
```

```bash
npm install @matthiesenxyz/astro-feedback
```

```bash
yarn add @matthiesenxyz/astro-feedback
```

2. Add the integration to your astro config

```diff
+import astroFeedback from "@matthiesenxyz/astro-feedback";

export default defineConfig({
  integrations: [
+    astroFeedback(),
  ],
});
```

### Configuration

TODO:configuration

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/matthiesenxyz/astro-feedback/blob/main/LICENSE). Made with ❤️ by [Adam Matthiesen](https://github.com/adammatthiesen).

## Acknowledgements

[astro-integration-template(kit)](https://github.com/florian-lefebvre/astro-integration-template) by Florian Lefebvre.
