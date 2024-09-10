import H1 from './H1.astro';
import H2 from './H2.astro';
import H3 from './H3.astro';
import H4 from './H4.astro';

export { H1, H2, H3, H4 };
export default { H1, H2, H3, H4 };

export type htmlHeadings = 'h1' | 'h2' | 'h3' | 'h4';
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AstroComponent = (_props: Record<string, any>) => any;

export const getAstroHeadingComponent: Record<htmlHeadings, AstroComponent> = {
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
};
