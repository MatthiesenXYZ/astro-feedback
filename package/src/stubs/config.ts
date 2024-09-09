import buildDeclarationFile from '@matthiesenxyz/astrodtsbuilder';

const dts = buildDeclarationFile();

dts.addSingleLineNote(
	"This file is generated by '@matthiesenxyz/astro-feedback' and should not be modified manually."
);

dts.addModule('astro-feedback:config', {
	defaultExport: {
		typeDef: "import('@matthiesenxyz/astro-feedback/schema').AstroFeedbackOptions",
		singleLineDescription: 'Astro Feedback options.',
	},
});

export const ConfigDTS = dts.makeAstroInjectedType('config.d.ts');

export default ConfigDTS;
