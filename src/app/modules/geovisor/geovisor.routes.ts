import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/geovisor-page/geovisor-page.component').then((m) => m.GeovisorPageComponent),
	},
];
