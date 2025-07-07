import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const EVENTS_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Seguimiento de Actas',
	resource: ResourceTypes.MENU_PROCEEDINGS,
	permission: 'canView',
	class: 'text-sm text-black! font-bold',
	icon: PrimeIcons.FILE,
	items: [
		{
			label: 'Reuniones y Sesiones por Grupo',
			resource: ResourceTypes.EVENTS,
			class: 'text-sm ',
			permission: 'canView',
			icon: PrimeIcons.FILE_PDF,
			routerLink: ['/monitoring/events'],
		},
	],
};
