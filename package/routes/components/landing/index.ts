import LandingButtonCard from './LandingButtonCard.astro';
import LandingDescription from './LandingDescription.astro';
import LandingLogo from './LandingLogo.astro';

type existingComponents = 'buttoncard' | 'description' | 'logo';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AstroComponent = (_props: Record<string, any>) => any;

const LandingComponentMap: Record<existingComponents, AstroComponent> = {
	buttoncard: LandingButtonCard,
	description: LandingDescription,
	logo: LandingLogo,
};

const getLandingComponent = (component: existingComponents) => {
	return LandingComponentMap[component];
};

export default getLandingComponent;
export { LandingButtonCard, LandingDescription, getLandingComponent };
export type { existingComponents };
