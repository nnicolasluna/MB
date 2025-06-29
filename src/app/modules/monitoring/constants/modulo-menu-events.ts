import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const EVENTS_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Seguimiento de Actas',
	resource: ResourceTypes.MENU_MEETS,
	permission: 'canView',
	class: 'text-sm text-black! font-bold',
	icon: PrimeIcons.SITEMAP,
	items: [
		{
			label: 'Reuniones y Sesiones por Grupo',
			resource: ResourceTypes.AGENDA,
			class: 'text-sm ',
			permission: 'canView',
			icon: PrimeIcons.USERS,
			routerLink: ['/monitoring/events'],
		},
	],
};
