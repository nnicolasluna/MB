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
			{
				path: 'resena',
				loadComponent: () =>
					import('./modules/pages/main/components/resena/resena.component').then((m) => m.ResenaComponent),
			},
			{
				path: 'coordinacion',
				loadComponent: () =>
					import('./modules/pages/main/components/coordinacion/coordinacion.component').then((m) => m.CoordinacionComponent),
			},
			{
				path: 'timeline',
				loadComponent: () =>
					import('./modules/pages/main/components/timeline/timeline.component').then((m) => m.TimelineComponent),
			},
			{
				path: 'informacion',
				loadComponent: () =>
					import('./modules/pages/main/components/informacion/informacion.component').then((m) => m.InformacionComponent),
			},
			{
				path: 'agenda',
				loadComponent: () =>
					import('./modules/pages/main/components/agenda/agenda.component').then((m) => m.AgendaComponent),
			},
			{
				path: 'repositorio',
				loadComponent: () =>
					import('./modules/pages/main/components/respositorio/respositorio.component').then((m) => m.RespositorioComponent),
			},
		],
	},
];
