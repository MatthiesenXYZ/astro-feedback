/** Type Definition for Default Exports */
type DefaultExport = {
	/**
	 * Type Definition
	 *
	 * - If you are importing a Type "import('@my-example/module').ExampleModule"
	 * - If you are importing a function "typeof import('@my-example/module').ExampleModule"
	 */
	typeDef: string;
	/** A single line description of the default export */
	singleLineDescription?: string;
	/** A multi-line description of the default export */
	multiLineDescription?: string[];
};

/** Type Definition for Named Exports */
type NamedExports = {
	/**
	 * Type Definition
	 *
	 * - If you are importing a Type "import('@my-example/module').ExampleType"
	 * - If you are importing a function "typeof import('@my-example/module').ExampleFunction"
	 */
	typeDef: string;
	/** The name of the exported function */
	name: string;
	/** A single line description of the export */
	singleLineDescription?: string;
	/** A multi-line description of the export */
	multiLineDescription?: string[];
};

/** Type Definition for Type Exports */
type TypeExports = {
	/**
	 * Type Definition
	 *
	 * @example "import('@my-example/module').ExampleType"
	 */
	typeDef: string;
	/** The name of the exported Type */
	name: string;
	/** A single line description of the export */
	singleLineDescription?: string;
	/** A multi-line description of the export */
	multiLineDescription?: string[];
};

/** Type for Add Module Declarations for Building Declaration Files */
export type AddModuleDeclarations = {
	/** Default Export */
	defaultExport?: DefaultExport;
	/** Named Exports */
	namedExports?: NamedExports[];
	/** Type Exports */
	typeExports?: TypeExports[];
};

/** Shared Template Options */
type SharedTemplateOptions = { type: string; name: string };

/** Astro 'config:setup:done` InjectedType */
type InjectedType = {
	filename: string;
	content: string;
};

/**
 * # Build a declaration file for Astro Integrations
 *
 * @description This utility function is used to build a declaration file for use with Astro's `injectTypes` function added in the `astro:config:done` Integration Hook in `Astro 4.14.0`. This function is useful for generating TypeScript declaration files for Astro Integrations.
 * @returns A builder object with methods to add notes, modules, and make the file
 * @example Example Usage
 * ```ts
 * // Import and use the function
 * const dts = buildDeclarationFile();
 *
 * // Add a note to the file
 * dts.addSingleLineNote(`This file was generated by '@my-example/module'`);
 *
 * // Add a Multi-line Note to the file
 * dts.addMultiLineNote(['It does some cool and helpful stuff', 'It also does some other cool stuff']);
 *
 * // Add a module with a default export and single line description
 * dts.addModule("example:module", {
 *   defaultExport: {
 *     typeDef: "import('@my-example/module').ExampleModule",
 *     singleLineDescription: "This is the default Module",
 *   }
 * });
 *
 * // Write the file
 * const dtsFile = dts.makeFile();
 *
 * // Output the file
 * console.log(dtsFile);
 * ```
 * @example Example Output
 * ```ts
 * // This file was generated by '@my-example/module'
 *
 * // It does some cool and helpful stuff
 * // It also does some other cool stuff
 *
 * declare module 'example:module' {
 *     //** This is the default Module * /
 *     const defaultExport: import('@my-example/module').ExampleModule;
 *     export default defaultExport;
 * }
 * ```
 */
export function buildDeclarationFile() {
	let DtsDeclaration = "";

	// Formatting Utilities

	/** Conform the indent of a string */
	function conformIndent(string: string): string {
		return `    ${string}`;
	}

	/** Add a new line to a string */
	function newLine(string: string): string {
		return `${string}\n`;
	}

	/** Add a Linebreak with a empty Line to a string */
	function lineBreak(string: string): string {
		return `${string}\n\n`;
	}

	// Templates

	/** Add a single line comment to the declaration file */
	function singleLineDescriptionTemplate(description: string): string {
		return newLine(conformIndent(`/** ${description} */`));
	}

	/** Add a multi-line comment to the declaration file */
	function multiLineDescriptionTemplate(description: string[]): string {
		let multiLineDescription = "";

		multiLineDescription += newLine(conformIndent("/**"));

		for (const line of description) {
			multiLineDescription += newLine(conformIndent(` * ${line}`));
		}

		multiLineDescription += newLine(conformIndent(" */"));

		return multiLineDescription;
	}

	/** Add a named export to the declaration file */
	function exportNamedTemplate({ name, type }: SharedTemplateOptions): string {
		return newLine(conformIndent(`export const ${name}: ${type};`));
	}

	/** Add a non-exported variable to the declaration file */
	function nonExportedTemplate({ name, type }: SharedTemplateOptions): string {
		return newLine(conformIndent(`const ${name}: ${type};`));
	}

	/** Add a default export to the declaration file */
	function defaultExportTemplate(name: string): string {
		return newLine(conformIndent(`export default ${name};`));
	}

	/** Add a default export to the declaration file */
	function exportDefaultTemplate(type: string): string {
		return (
			nonExportedTemplate({ type, name: "defaultExport" }) +
			defaultExportTemplate("defaultExport")
		);
	}

	/** Add a type export to the declaration file */
	function exportTypeTemplate({ name, type }: SharedTemplateOptions): string {
		return newLine(conformIndent(`export type ${name} = ${type};`));
	}

	// Builders

	/** Build the default export */
	function buildDefaultExport(defaultExport: DefaultExport): string {
		let builtDefaultExport = "";
		const { typeDef, multiLineDescription, singleLineDescription } =
			defaultExport;

		// Add single line description if it exists
		if (singleLineDescription) {
			builtDefaultExport += singleLineDescriptionTemplate(
				singleLineDescription,
			);
		}

		// Add multi-line description if it exists
		if (multiLineDescription) {
			builtDefaultExport += multiLineDescriptionTemplate(multiLineDescription);
		}

		// Add the default export
		builtDefaultExport += exportDefaultTemplate(typeDef);

		return builtDefaultExport;
	}

	/** Build the named exports */
	function buildNamedExports(namedExports: NamedExports[]): string {
		let builtNamedExports = "";
		for (const {
			typeDef: type,
			name,
			singleLineDescription,
			multiLineDescription,
		} of namedExports) {
			// Add single line description if it exists
			if (singleLineDescription) {
				builtNamedExports += singleLineDescriptionTemplate(
					singleLineDescription,
				);
			}

			// Add multi-line description if it exists
			if (multiLineDescription) {
				builtNamedExports += multiLineDescriptionTemplate(multiLineDescription);
			}

			// Add the named export
			builtNamedExports += exportNamedTemplate({ type, name });
		}
		return builtNamedExports;
	}

	/** Build the Type exports */
	function buildTypeExports(typeExports: TypeExports[]): string {
		let builtTypeExports = "";
		for (const {
			typeDef: type,
			name,
			singleLineDescription,
			multiLineDescription,
		} of typeExports) {
			// Add single line description if it exists
			if (singleLineDescription) {
				builtTypeExports += singleLineDescriptionTemplate(
					singleLineDescription,
				);
			}

			// Add multi-line description if it exists
			if (multiLineDescription) {
				builtTypeExports += multiLineDescriptionTemplate(multiLineDescription);
			}

			// Add the named export
			builtTypeExports += exportTypeTemplate({ type, name });
		}
		return builtTypeExports;
	}

	function buildModule(moduleName: string, moduleDeclarations: string): string {
		return (
			newLine(`declare module '${moduleName}' {`) +
			newLine(moduleDeclarations) +
			lineBreak("}")
		);
	}

	// Strings

	/** Error Message if module is not complete */
	function ErrorMessage(moduleName: string): string {
		return `Error creating module: ${moduleName}. No exports found, You must provide either a default export, named exports, or Type Definitions.`;
	}

	return {
		/**
		 * # Add a single line Note to your file
		 *
		 * @example
		 * ```ts
		 * // Import and use the function
		 * const dts = buildDeclarationFile();
		 *
		 * // Add a note to the file
		 * dts.addSingleLineNote(`This file was generated by @my-example/module`);
		 * ```
		 */
		addSingleLineNote(note: string): void {
			DtsDeclaration += lineBreak(`// ${note}`);
		},
		/**
		 * # Add a multi line Note to your file
		 *
		 * @example
		 * ```ts
		 * // Import and use the function
		 * const dts = buildDeclarationFile();
		 *
		 * // Add a note to the file
		 * dts.addMultiLineNote(['This file was generated by `@my-example/module`', 'It does some cool and helpful stuff']);
		 * ```
		 */
		addMultiLineNote(note: string[]): void {
			for (const [index, value] of note.entries()) {
				const isLast = index === note.length - 1;

				if (isLast) {
					DtsDeclaration += lineBreak(`// ${value}`);
				}
				DtsDeclaration += newLine(`// ${value}`);
			}
		},
		/**
		 * # Add a Module Declaration to your file
		 *
		 * @example
		 * ```ts
		 * // Import and use the function
		 * const dts = buildDeclarationFile();
		 *
		 * // Add a module with a default export and single line description
		 * dts.addModule("example:module", {
		 *   defaultExport: {
		 *     typeDef: "import('@my-example/module').ExampleModule",
		 *     singleLineDescription: "This is the default Module",
		 *   }
		 * });
		 *
		 * // Add a module with named exports and multi-line descriptions
		 * dts.addModule("example:module-two", {
		 *   namedExports: [
		 *     {
		 *       typeDef: "import('@my-example/module').ExampleModuleTwo_typeOne",
		 *       name: "ExampleModuleTwo_typeOne",
		 *       multiLineDescription: [ "This is the second module", "It does some cool stuff" ],
		 *     },
		 *     {
		 *       typeDef: "import('@my-example/module').ExampleModuleTwo_typeTwo",
		 *       name: "ExampleModuleTwo_typeTwo",
		 *       multiLineDescription: [ "# Type Two", "This Type is also important" ]
		 *     },
		 *   ],
		 * });
		 * ```
		 */
		addModule(
			/** The name of the Virtual Module */
			moduleName: string,
			/** Module Declarations */
			declarations: AddModuleDeclarations,
		): void {
			// Destructure the options
			const { defaultExport, namedExports, typeExports } = declarations;

			if (!defaultExport && !namedExports && !typeExports) {
				throw new Error(ErrorMessage(moduleName));
			}

			let moduleDeclarations = "";

			// Add default export if it exists
			if (defaultExport) {
				moduleDeclarations += buildDefaultExport(defaultExport);
			}

			// Add named exports if they exist
			if (namedExports) {
				moduleDeclarations += buildNamedExports(namedExports);
			}

			// Add type exports if they exist
			if (typeExports) {
				moduleDeclarations += buildTypeExports(typeExports);
			}

			// Add the module to the declaration file
			DtsDeclaration += buildModule(moduleName, moduleDeclarations);
		},
		/**
		 * # Add an Unformatted String to your file
		 *
		 * @example
		 * ```ts
		 * // Import and use the function
		 * const dts = buildDeclarationFile();
		 *
		 * // Add a string with your own formatting to the file
		 * dts.addUnformattedString(`declare module 'example:module' { export const foo: string; }`);
		 * ```
		 */
		addUnformattedString(string: string): void {
			DtsDeclaration += newLine(string);
		},
		/**
		 * # Make the Declaration File
		 *
		 * @returns The TypeScript Declaration File as a string for use with Astro's `injectTypes` function added in the `astro:config:done` Integration Hook in `Astro 4.14.0`
		 * @example
		 * ```ts
		 * // Import and use the function
		 * const dts = buildDeclarationFile();
		 *
		 * // Add a note to the file
		 * dts.addSingleLineNote(`This file was generated by @my-example/module`);
		 *
		 * // Build the example file
		 * const dtsFile = dts.makeFile();
		 * ```
		 */
		makeFile(): string {
			return DtsDeclaration;
		},
		/**
		 * # Make an Injected Type for Astro Integrations
		 *
		 * @param filename The name of the file to be injected
		 * @returns An Injected Type for use with Astro's `injectTypes` function added in the `astro:config:done` Integration Hook in `Astro 4.14.0`
		 * @example
		 * ```ts
		 * const integration: AstroIntegration = (opts: {}) => {
		 *   // Import and use the function
		 *   const dts = buildDeclarationFile();
		 *
		 *   // Add a note to the file
		 *   dts.addSingleLineNote(`This file was generated by '@my-example/module'`);
		 *
		 *   // Add a module with a default export and single line description
		 *   dts.addModule("example:module", {
		 *     defaultExport: {
		 *       typeDef: "import('@my-example/module').ExampleModule",
		 *       singleLineDescription: "This is the default Module",
		 *     }
		 *   });
		 *
		 *   // Make the injectTypes options
		 *   const exampleDTS = dts.makeAstroInjectedType("example.d.ts");
		 *
		 *   // Astro Integration
		 *   return {
		 *     name: "@my-example/module",
		 *     hooks: {
		 *       "astro:config:done": ({ injectTypes }) => {
		 *         injectTypes(exampleDTS);
		 *       }
		 *     }
		 *   }
		 * }
		 * ```
		 */
		makeAstroInjectedType(filename: string): InjectedType {
			return {
				filename,
				content: DtsDeclaration,
			};
		},
	};
}

export default buildDeclarationFile;
