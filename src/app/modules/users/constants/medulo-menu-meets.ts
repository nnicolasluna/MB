import { ResourceTypes } from '@shared/constants';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PrimeIcons } from 'primeng/api';

export const MEETS_MENU_ENTRIES: ExtendedMenuItem = {
    label: 'Reuniones y Convocatorias',
    resource: ResourceTypes.MENU_MEETS,
    permission: 'canView',
    class: 'bg-primary-300 text-sm text-black! font-bold',
    icon: PrimeIcons.USERS,
    items: [
        {
            label: 'Administración de Sesiones',
            resource: ResourceTypes.USERS,
            class: 'text-sm',
            permission: 'canView',
            icon: PrimeIcons.USERS,
            routerLink: ['/users'],
        },

    ],
};
