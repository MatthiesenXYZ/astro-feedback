export const routeMap = {
	index: "/",
	login: "/login",
	logout: "/logout",
	submitfeedback: "/[project]/submit-feedback",
	portal: "/portal",
	manageTeams: "/portal/teams",
	manageSingleTeam: "/portal/teams/[team]",
	manageProject: "/portal/[project]",
	submission: "/portal/[project]/[submission]",
	manageUsers: "/portal/users",
	manageSingleUser: "/portal/users/[user]",
	admin: "/portal/admin",
	api: {
		login: "/api/login",
		logout: "/api/logout",
		users: "/api/users",
		teams: "/api/teams",
		projects: "/api/projects",
		submissions: "/api/submissions",
		mailer: "/api/mailer",
	},
};

export default routeMap;
