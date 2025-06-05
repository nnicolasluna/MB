import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const USER_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Administración de Usuarios',
	resource: ResourceTypes.MENU_USERS,
	permission: 'canView',
	class: 'text-sm text-black! font-bold',
	icon: PrimeIcons.USERS,
	items: [
		{
			label: 'Configuración de Usuarios',
			resource: ResourceTypes.USERS,
			class: 'text-sm',
			permission: 'canView',
			icon: PrimeIcons.USERS,
			routerLink: ['/users'],
		},
		{
			label: 'Administración de Roles',
			resource: ResourceTypes.ROLES,
			permission: 'canView',
			class: 'text-sm',
			icon: PrimeIcons.KEY,
			routerLink: ['/users/roles'],
		},
		{
			label: 'Administración de Permisos',
			resource: ResourceTypes.SYSTEM_PERMISSIONS,
			permission: 'canView',
			class: 'text-sm',
			icon: PrimeIcons.TABLE,
			routerLink: ['/users/permissions'],
		},
		{
			label: 'Registro de Actividades',
			resource: ResourceTypes.LOG_ACTIVITIES,
			permission: 'canView',
			class: 'text-sm',
			icon: PrimeIcons.LIST,
			routerLink: ['/users/log-activities'],
		},
	],
};
