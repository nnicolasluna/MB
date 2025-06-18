import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const MEMBERS_MENU_ENTRIES: ExtendedMenuItem = {
    label: 'Miembros y Comite',
    resource: ResourceTypes.MENU_MEETS,
    permission: 'canView',
    class: 'text-sm text-black! font-bold',
    icon: PrimeIcons.SITEMAP,
    items: [
        {
            label: 'Grupos de Trabajo',
            resource: ResourceTypes.AGENDA,
            class: 'text-sm ',
            permission: 'canView',
            icon: PrimeIcons.USERS,
            routerLink: ['/members/group'],
        },

    ],
};
