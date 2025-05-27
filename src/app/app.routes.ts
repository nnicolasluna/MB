import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/layouts/main/main.layout';
import { authenticationGuard, systemPermissionGuard, verifyLoginGuard } from '@shared/guards';

export const routes: Routes = [
	{
		path: 'auth',
		canActivate: [verifyLoginGuard],
		loadChildren: (): Promise<Routes> => import('./modules/auth/auth.routes').then((m) => m.routes),
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'auth/login',
	},
	{
		path: '',
		component: MainLayout,
		canActivate: [authenticationGuard],
		canActivateChild: [authenticationGuard, systemPermissionGuard],
		children: [
			{
				path: 'home',
				loadChildren: (): Promise<Routes> => import('./modules/home/home.routes').then((m) => m.routes),
			},
			{
				path: 'users',
				loadChildren: (): Promise<Routes> => import('./modules/users/users.routes').then((m) => m.routes),
			},
			{
				path: 'coverages',
				loadChildren: (): Promise<Routes> => import('./modules/map-data/mapData.routes').then((m) => m.routes),
			},
			{
				path: 'monitoring',
				loadChildren: (): Promise<Routes> => import('./modules/monitoring/monitoring.routes').then((m) => m.routes),
			},
		],
	},
	// {
	// 	path: 'geovisualizador',
	// 	loadChildren: (): Promise<Routes> => import('./modules/geovisor/geovisor.routes').then((m) => m.routes),
	// },
];
