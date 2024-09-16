import type { APIContext, APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context: APIContext) => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
	});
};

export const POST: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const HEAD: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const PUT: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const DELETE: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const CONNECT: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const TRACE: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const PATCH: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Supported',
	});
};

export const ALL: APIRoute = async () => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
	});
};
