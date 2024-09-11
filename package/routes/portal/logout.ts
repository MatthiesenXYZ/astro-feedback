import r from 'astro-feedback:routes';
import type { APIRoute } from 'astro';

export const ALL: APIRoute = async ({ redirect }) => {
	return redirect(r.api.logout);
};
