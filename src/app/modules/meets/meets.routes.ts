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
	{
		path: 'calendar/:name',
		data: {
			moduleCode: ResourceTypes.AGENDA,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/agenda/components/agenda-calendar/agenda-calendar.component').then((m) => m.AgendaCalendarComponent),
	},
	{
		path: 'activities',
		data: {
			moduleCode: ResourceTypes.AGENDA,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/agenda/components/form-actividades/form-actividades.component').then((m) => m.FormActividadesComponent),
	},
	{
		path: 'activitiesByGroup/:name/:id',
		data: {
			moduleCode: ResourceTypes.AGENDA,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/session/activity/activity.component').then((m) => m.ActivityComponent),
	},
];

