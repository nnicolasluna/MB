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
		/* canActivate: [authenticationGuard],
		canActivateChild: [authenticationGuard, systemPermissionGuard], */
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
				path: 'meets',
				loadChildren: (): Promise<Routes> => import('./modules/meets/meets.routes').then((m) => m.routes),
			},
			{
				path: 'docs',
				loadChildren: (): Promise<Routes> => import('./modules/docs/docs.routes').then((m) => m.routes),
			},
		],
	},
];
