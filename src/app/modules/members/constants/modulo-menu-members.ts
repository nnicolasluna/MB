import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const MEMBERS_MENU_ENTRIES: ExtendedMenuItem = {
    label: 'Miembros y Comite',
    resource: ResourceTypes.MENU_GROUP,
    permission: 'canView',
    class: 'text-sm text-black! font-bold',
    icon: PrimeIcons.USERS,
    items: [
        {
            label: 'Grupos de Trabajo',
            resource: ResourceTypes.GROUP,
            class: 'text-sm ',
            permission: 'canView',
            icon: PrimeIcons.USERS,
            routerLink: ['/members/group'],
        },

    ],
};
