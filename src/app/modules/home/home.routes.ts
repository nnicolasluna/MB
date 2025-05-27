import { Type } from '@angular/core';
import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: (): Promise<Type<unknown>> => import('./home.component').then((m) => m.HomeComponent),
	},
];
