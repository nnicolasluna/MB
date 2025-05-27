import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

export const routes: Routes = [
	{
		path: '',
		data: {
			moduleCode: ResourceTypes.CARTOGRAPHIC_RESOURCES,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/map-data-page/map-data-page.component').then((m) => m.MapDataPageComponent),
	},
	{
		path: 'styles',
		data: {
			moduleCode: ResourceTypes.CARTOGRAPHIC_STYLES,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/styles-page/styles-page.component').then((m) => m.StylesPageComponent),
	},
];
