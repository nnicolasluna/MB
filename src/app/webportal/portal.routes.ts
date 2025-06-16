import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./modules/pages/main/main.component').then((m) => m.MainComponent),
		children: [
			{
				path: '',
				redirectTo: 'inicio',
				pathMatch: 'full',
			},
			{
				path: 'inicio',
				loadComponent: () =>
					import('./modules/pages/main/components/inicio/inicio.component').then((m) => m.InicioComponent),
			},
		],
	},
];
