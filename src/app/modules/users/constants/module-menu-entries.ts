import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const USER_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Usuarios',
	resource: ResourceTypes.MENU_USERS,
	permission: 'canView',
	class: 'bg-primary hover:bg-primary-800! text-white!',
	icon: PrimeIcons.USERS,
	items: [
		{
			label: 'Administración de Usuarios',
			resource: ResourceTypes.USERS,
			permission: 'canView',
			icon: PrimeIcons.USERS,
			routerLink: ['/users'],
		},
		{
			label: 'Administración de Roles',
			resource: ResourceTypes.ROLES,
			permission: 'canView',
			icon: PrimeIcons.KEY,
			routerLink: ['/users/roles'],
		},
		{
			label: 'Administración de Permisos',
			resource: ResourceTypes.SYSTEM_PERMISSIONS,
			permission: 'canView',
			icon: PrimeIcons.TABLE,
			routerLink: ['/users/permissions'],
		},
		{
			label: 'Registro de Actividades',
			resource: ResourceTypes.LOG_ACTIVITIES,
			permission: 'canView',
			icon: PrimeIcons.LIST,
			routerLink: ['/users/log-activities'],
		},
	],
};
