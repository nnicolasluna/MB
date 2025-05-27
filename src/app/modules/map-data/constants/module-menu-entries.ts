import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const MAP_DATA_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Recursos Cartográficos',
	resource: ResourceTypes.MENU_CARTOGRAPHIC,
	permission: 'canView',
	class: 'bg-primary hover:bg-primary-800! text-white! mt-2!',
	icon: PrimeIcons.MAP,
	items: [
		{
			label: 'Coberturas',
			resource: ResourceTypes.CARTOGRAPHIC_RESOURCES,
			permission: 'canView',
			icon: PrimeIcons.MAP,
			routerLink: ['/coverages'],
		},
		{
			label: 'Estilos',
			resource: ResourceTypes.CARTOGRAPHIC_STYLES,
			permission: 'canView',
			icon: PrimeIcons.PALETTE,
			routerLink: ['/coverages/styles'],
		},
	],
};
