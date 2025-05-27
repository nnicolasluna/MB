import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

export const routes: Routes = [
	{
		path: '',
		data: {
			moduleCode: ResourceTypes.USERS,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/user-page/user-page.component').then((m) => m.UserPageComponent),
	},
	{
		path: 'roles',
		data: {
			moduleCode: ResourceTypes.ROLES,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/roles-page/roles-page.component').then((m) => m.RolesPageComponent),
	},
	{
		path: 'permissions',
		data: {
			moduleCode: ResourceTypes.SYSTEM_PERMISSIONS,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/permission-page/permission-page.component').then((m) => m.PermissionPageComponent),
	},
	{
		path: 'log-activities',
		data: {
			moduleCode: ResourceTypes.LOG_ACTIVITIES,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/activity-page/activity-page.component').then((m) => m.ActivityPageComponent),
	},
];
