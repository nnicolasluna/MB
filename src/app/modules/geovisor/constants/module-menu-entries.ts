import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const GEOVISOR_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Geovisualizador',
	icon: PrimeIcons.GLOBE,
	routerLink: ['/geovisualizador'],
	class: 'bg-primary hover:bg-primary-800! text-white! mt-2!',
};
