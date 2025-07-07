import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const DOCS_MENU_ENTRIES: ExtendedMenuItem = {
	label: 'Repositorio de Información y Documentos',
	resource: ResourceTypes.MENU_DOCS,
	permission: 'canView',
	class: 'text-sm text-black! font-bold',
	icon: PrimeIcons.BOOK,
	items: [
		{
			label: 'Documentos por Grupo de Trabajo',
			resource: ResourceTypes.WORKING,
			class: 'text-sm ',
			permission: 'canView',
			icon: PrimeIcons.USERS,
			routerLink: ['/docs/workingGroup'],
		},
		{
			label: 'Documentos Oficiales',
			resource: ResourceTypes.OFFICIAL,
			class: 'text-sm',
			permission: 'canView',
			icon: PrimeIcons.PEN_TO_SQUARE,
			routerLink: ['/docs/official'],
		},
	],
};
