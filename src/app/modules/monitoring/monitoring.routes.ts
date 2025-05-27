import { Routes } from '@angular/router';
import { ResourceTypes } from '@shared/constants';

// TODO: change resourceTypes
export const routes: Routes = [
	{
		path: '',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-page/monitoring-page.component').then((m) => m.MonitoringPageComponent),
	},
	{
		path: 'fire',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-fire-page/monitoring-fire-page.component').then((m) => m.MonitoringFirePageComponent),
	},
	{
		path: 'fire/risk',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-risk-fire-page/monitoring-risk-fire-page.component').then(
				(m) => m.MonitoringRiskFirePageComponent,
			),
	},
	{
		path: 'fire/burn',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-burn-page/monitoring-burn-page.component').then((m) => m.MonitoringBurnPageComponent),
	},
	{
		path: 'water',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-water-page/monitoring-water-page.component').then(
				(m) => m.MonitoringWaterPageComponent,
			),
	},
	{
		path: 'hot-spot',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () => import('./pages/hot-spot-page/hot-spot-page.component').then((m) => m.HotSpotPageComponent),
	},
	{
		path: 'use-land',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-use-land-page/monitoring-use-land-page.component').then(
				(m) => m.MonitoringUseLandPageComponent,
			),
	},
	{
		path: 'soil',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-soil-page/monitoring-soil-page.component').then((m) => m.MonitoringSoilPageComponent),
	},
	{
		path: 'soil/soil-degradation',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/monitoring-soil-degradation-page/monitoring-soil-degradation-page.component').then(
				(m) => m.MonitoringSoilDegradationPageComponent,
			),
	},
	{
		path: 'soil/alerts',
		data: {
			moduleCode: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
		},
		loadComponent: () =>
			import('./pages/soil-alert-page/soil-alert-page.component').then((m) => m.SoilAlertPageComponent),
	},
];
