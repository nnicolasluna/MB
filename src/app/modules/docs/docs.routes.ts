import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

export const routes: Routes = [
	{
		path: 'official',
		data: {
			moduleCode: ResourceTypes.SESSIONS,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/official/official.component').then((m) => m.OfficialComponent),
	},
];
