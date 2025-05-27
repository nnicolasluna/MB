import { Type } from '@angular/core';
import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'login',
		loadComponent: (): Promise<Type<unknown>> => import('./pages/login/login.component').then((m) => m.LoginComponent),
	},
	{
		path: 'confirmation/:token',
		loadComponent: (): Promise<Type<unknown>> =>
			import('./pages/confirmation/confirmation.component').then((m) => m.ConfirmationComponent),
	},
	{
		path: 'forgot-password',
		loadComponent: (): Promise<Type<unknown>> =>
			import('./pages/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
	},
];
