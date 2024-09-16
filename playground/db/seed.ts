import {
	AstroFeedbackAdmin,
	AstroFeedbackProject,
	AstroFeedbackTeam,
	AstroFeedbackUser,
	db,
} from 'astro:db';

export default async function seed() {
	// Insert a user
	await db.insert(AstroFeedbackUser).values([
		{
			id: '15655ac8-9b6d-48d6-91a0-1cca2f753305',
			url: 'https://github.com/Adammatthiesen',
			username: 'Adammatthiesen',
			name: 'Adam Matthiesen',
			email: 'amatthiesen@outlook.com',
			githubId: 30383579,
			avatar: 'https://avatars.githubusercontent.com/u/30383579?v=4',
			createdAt: new Date('2024-09-11T13:42:53.914Z'),
			updatedAt: new Date('2024-09-11T13:42:53.914Z'),
		},
	]);
	// Insert a admin
	await db
		.insert(AstroFeedbackAdmin)
		.values([{ id: '1', userId: '15655ac8-9b6d-48d6-91a0-1cca2f753305' }]);
	// Insert a team
	await db.insert(AstroFeedbackTeam).values([
		{
			id: '1',
			name: 'Team 1',
			description: 'Team 1 description',
			users: ['15655ac8-9b6d-48d6-91a0-1cca2f753305'],
		},
	]);
	// Insert a project
	await db.insert(AstroFeedbackProject).values([
		{
			id: crypto.randomUUID(),
			title: 'My fun Astro project',
			description: 'test',
			teamId: '1',
			owner: '1',
			createdAt: new Date(),
			submissionsOpen: true,
			defaultProject: true,
		},
		{
			id: crypto.randomUUID(),
			title: 'My cool Astro project',
			description: 'test',
			teamId: '1',
			owner: '1',
			createdAt: new Date(),
			submissionsOpen: true,
			defaultProject: false,
		},
	]);
}
