import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const DOCS_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Repositorio de Información y Documentos',
	resource: ResourceTypes.MENU_MEETS,
	permission: 'canView',
	class: 'text-sm text-black! font-bold',
	icon: PrimeIcons.SITEMAP,
	items: [
		{
			label: 'Documentos por Grupo de Trabajo',
			resource: ResourceTypes.AGENDA,
			class: 'text-sm ',
			permission: 'canView',
			icon: PrimeIcons.USERS,
			routerLink: ['/meets/agenda'],
		},
		{
			label: 'Documentos Oficiales',
			resource: ResourceTypes.AGENDA,
			class: 'text-sm',
			permission: 'canView',
			icon: PrimeIcons.USERS,
			routerLink: ['/docs/official'],
		},
	],
};
