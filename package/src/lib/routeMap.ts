import type { RouteMap } from '~types/index.ts';

export const routeMap: RouteMap = {
	base: {
		index: '/',
		feedback: '/submit-feedback',
	},
	portal: {
		index: '/portal',
		login: '/portal/login',
		logout: '/portal/logout',
		teams: {
			index: '/portal/teams',
			viewTeam: '/portal/teams/[team]',
			editTeam: '/portal/teams/[team]/edit',
			newTeam: '/portal/teams/new',
		},
		projects: {
			index: '/portal/projects',
			viewProject: '/portal/projects/[project]',
			editProject: '/portal/projects/[project]/edit',
			newProject: '/portal/projects/new',
		},
		submissions: {
			index: '/portal/projects/[project]/submissions',
			viewSubmission: '/portal/projects/[project]/submissions/[submission]',
			newSubmission: '/portal/projects/[project]/submissions/new',
		},
		users: {
			index: '/portal/users',
			viewUser: '/portal/users/[user]',
			editUser: '/portal/users/[user]/edit',
		},
	},
	api: {
		login: '/api/login',
		callback: '/api/callback',
		logout: '/api/logout',
		users: '/api/users',
		teams: '/api/teams',
		projects: '/api/projects',
		submissions: '/api/submissions',
		mailer: '/api/mailer',
		captcha: '/api/verify-captcha',
	},
};

export default routeMap;
