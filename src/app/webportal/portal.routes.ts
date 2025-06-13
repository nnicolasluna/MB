import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

export const routes: Routes = [
	{
		path: '',
		data: {
			moduleCode: ResourceTypes.USERS,
			permission: 'canView',
		},
		loadComponent: () => import('./modules/pages/main/main.component').then((m) => m.MainComponent),
	},

];
