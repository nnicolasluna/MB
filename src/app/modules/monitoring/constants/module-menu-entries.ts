import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const MONITORING_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Monitoreo',
	resource: ResourceTypes.MENU_MONITORING,
	permission: 'canView',
	class: 'bg-primary hover:bg-primary-800! text-white! mt-2!',
	icon: PrimeIcons.WIFI,
	items: [
		{
			label: 'Monitoreo',
			resource: ResourceTypes.MENU_MONITORING,
			permission: 'canView',
			icon: PrimeIcons.DESKTOP,
			routerLink: ['/monitoring'],
			items: [
				{
					label: 'Monitoreo de Fuego',
					resource: ResourceTypes.MENU_MONITORING,
					permission: 'canView',
					icon: PrimeIcons.WIFI,
					routerLink: ['/monitoring/fire'],
				},
				{
					label: 'Monitoreo de Cuerpos de Agua',
					resource: ResourceTypes.MENU_MONITORING,
					permission: 'canView',
					icon: PrimeIcons.WIFI,
					routerLink: ['/monitoring/water'],
				},
				{
					label: 'Monitoreo de Uso de Suelo',
					resource: ResourceTypes.MENU_MONITORING,
					permission: 'canView',
					icon: PrimeIcons.WIFI,
					routerLink: ['/monitoring/soil'],
				},
				{
					label: 'Monitoreo de Degradación de Suelos',
					resource: ResourceTypes.MENU_MONITORING,
					permission: 'canView',
					icon: PrimeIcons.WIFI,
					routerLink: ['/monitoring/soil/soil-degradation'],
				},
			],
		},
	],
};
