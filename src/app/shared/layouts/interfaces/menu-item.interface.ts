import { ResourceTypes } from '@shared/constants';
import { permissionTypes } from '@shared/interfaces';
import { PrimeIcons, MenuItem } from 'primeng/api';

type iconString = 'pi pi-${string}';

export type ExtendedMenuItem = MenuItem & {
	icon?: PrimeIcons | iconString;
	resource?: ResourceTypes;
	permission?: permissionTypes;
	isPublic?: boolean;
	badgeClass?: string;
	class?: string;
};
