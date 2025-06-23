import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

export const routes: Routes = [
	{
		path: 'group',
		data: {
			moduleCode: ResourceTypes.SESSIONS,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/groups/groups.component').then((m) => m.GroupsComponent),
	},
	{
		path: 'work-meetings/:name',
		data: {
			moduleCode: ResourceTypes.SESSIONS,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/workmeetings/workmeetings.component').then((m) => m.WorkmeetingsComponent),
	},
];
