import { MAILER_API_CRYPTO_KEY } from 'astro:env/server';
import type { APIContext, APIRoute } from 'astro';

export const prerender = false;

type MailerPostRequestBody = {
	cryptoKey: string;
	recipients: string[];
	subject: string;
	body: string;
};

export const POST: APIRoute = async ({ request }: APIContext) => {
	// Get the request body
	const body: MailerPostRequestBody = await request.json();

	// Verify the crypto key
	if (body.cryptoKey !== MAILER_API_CRYPTO_KEY) {
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	// Send the email

	// try {

	// } catch (error) {
	// 	return new Response(null, {
	// 		status: 500,
	// 		statusText: 'Internal Server Error',
	// 	});
	// }

	return new Response(null, {
		status: 204,
		statusText: 'No Content',
	});
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		statusText: 'No Content',
		headers: {
			Allow: 'OPTIONS, POST',
			Date: new Date().toUTCString(),
			'Cache-Control': 'public, max-age=604800, immutable',
		},
	});
};

export const ALL: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
	});
};
