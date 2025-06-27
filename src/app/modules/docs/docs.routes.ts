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
	{
		path: 'workingGroup',
		data: {
			moduleCode: ResourceTypes.SESSIONS,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/working-group/working-group.component').then((m) => m.WorkingGroupComponent),
	},
	{
		path: 'sub-category/:name/:id',
		data: {
			moduleCode: ResourceTypes.SESSIONS,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/official/components/sub-category/sub-category.component').then((m) => m.SubCategoryComponent),
	},
];
