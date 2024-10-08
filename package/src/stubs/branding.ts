import buildDeclarationFile from '@matthiesenxyz/astrodtsbuilder';
import { name } from '../../package.json';

const dts = buildDeclarationFile();

dts.addSingleLineNote(`This file is generated by '${name}' and should not be modified manually.`);

dts.addModule('astro-feedback:branding', {
	defaultExport: {
		typeDef: `import('${name}/types').Branding`,
		singleLineDescription: 'Astro Feedback Branding Resources.',
	},
});

export const BrandingDTS = dts.makeAstroInjectedType('branding.d.ts');

export default BrandingDTS;
