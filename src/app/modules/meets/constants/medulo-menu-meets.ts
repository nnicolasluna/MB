import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const MEETS_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Reuniones y Convocatorias',
	resource: ResourceTypes.MENU_MEETS,
	permission: 'canView',
	class: 'text-sm text-black! font-bold',
	icon: PrimeIcons.SITEMAP,
	items: [
		{
			label: 'Administración de Agenda',
			resource: ResourceTypes.SESSIONS,
			class: 'text-sm',
			permission: 'canView',
			icon: PrimeIcons.USERS,
			routerLink: ['/meets/session'],
		},
		/* 		{
					label: 'Administración de Agenda',
					resource: ResourceTypes.AGENDA,
					class: 'text-sm',
					permission: 'canView',
					icon: PrimeIcons.USERS,
					routerLink: ['/meets/agenda'],
				}, */
	],
};
