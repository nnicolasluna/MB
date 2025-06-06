import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

export const routes: Routes = [
	{
		path: 'session',
		data: {
			moduleCode: ResourceTypes.SESSIONS,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/session/session.component').then((m) => m.SessionComponent),
	},
	{
		path: 'agenda',
		data: {
			moduleCode: ResourceTypes.AGENDA,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/agenda/agenda.component').then((m) => m.AgendaComponent),
	},
];
