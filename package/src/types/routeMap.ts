// Type definitions for the route map
export type RouteMap = {
	base: {
		index: string;
		feedback: string;
	};
	portal: {
		index: string;
		login: string;
		logout: string;
		teams: {
			index: string;
			viewTeam: string;
			editTeam: string;
			newTeam: string;
		};
		projects: {
			index: string;
			viewProject: string;
			editProject: string;
			newProject: string;
		};
		submissions: {
			index: string;
			viewSubmission: string;
			newSubmission: string;
		};
		users: {
			index: string;
			viewUser: string;
			editUser: string;
		};
	};
	api: {
		login: string;
		callback: string;
		logout: string;
		users: string;
		teams: string;
		projects: string;
		submissions: string;
		mailer: string;
	};
};
