export type permissionTypes = 'canCreate' | 'canView' | 'canUpdate' | 'canDelete' | 'isAdmin' | 'isSuperAdmin';

export interface Permissions {
	NONE?: number;
	CAN_CREATE?: number;
	CAN_READ?: number;
	CAN_UPDATE?: number;
	CAN_DELETE?: number;
	IS_ADMIN?: number;
	IS_SUPER_ADMIN?: number;
}
