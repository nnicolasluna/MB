import { inject, Injectable } from '@angular/core';
import { CredentialsService } from './credentials.service';
import { permissionTypes } from '@shared/interfaces';
import { ResourceTypes, SystemPermissions } from '@shared/constants';

@Injectable({
	providedIn: 'root',
})
export class PermissionsService {
	private credentialsService = inject(CredentialsService);

	public handleAccess(resource: ResourceTypes, right: permissionTypes, isPublic: boolean = false) {
		if (isPublic) return true;

		const userPermission = this.credentialsService.getAccess()?.[resource];
		if (!userPermission) return false;

		const isSuperAdmin = this.calculatePermission(SystemPermissions.RIGHT_SUPER_ADMIN, userPermission.permission);
		if (isSuperAdmin) return true;

		switch (right) {
			case 'canView':
				return this.calculatePermission(SystemPermissions.RIGHT_READ, userPermission.permission);
			case 'canCreate':
				return this.calculatePermission(SystemPermissions.RIGHT_CREATE, userPermission.permission);
			case 'canDelete':
				return this.calculatePermission(SystemPermissions.RIGHT_DELETE, userPermission.permission);
			case 'canUpdate':
				return this.calculatePermission(SystemPermissions.RIGHT_UPDATE, userPermission.permission);
			case 'isAdmin':
				return this.calculatePermission(SystemPermissions.RIGHT_ADMIN, userPermission.permission);
			default:
				return false;
		}
	}

	private calculatePermission(permission: number, currentAccess: number) {
		const res = (permission & currentAccess) == permission;
		return res;
	}

	public canView(resource: ResourceTypes) {
		const res = this.handleAccess(resource, 'canView');
		return res;
	}

	public canCreate(resource: ResourceTypes) {
		return this.handleAccess(resource, 'canCreate');
	}

	public canDelete(resource: ResourceTypes) {
		return this.handleAccess(resource, 'canDelete');
	}

	public canUpdate(resource: ResourceTypes) {
		return this.handleAccess(resource, 'canUpdate');
	}

	public parseRights(data: any) {
		if (!data) return { NONE: SystemPermissions.RIGHT_NONE };
		let tmpPermission = data.toString(2).split('');
		const sizePermission = 7 - tmpPermission.length;
		if (sizePermission > 0) {
			const tmpCerosArray = Array.from({ length: sizePermission }, () => '0');
			tmpPermission = [...tmpCerosArray, ...tmpPermission];
		}
		return {
			CAN_READ: tmpPermission[5] == '1' ? true : false,
			CAN_UPDATE: tmpPermission[4] == '1' ? true : false,
			CAN_CREATE: tmpPermission[3] == '1' ? true : false,
			CAN_DELETE: tmpPermission[2] == '1' ? true : false,
			IS_ADMIN: tmpPermission[1] == '1' ? true : false,
			IS_SUPER_ADMIN: tmpPermission[0] == '1' ? true : false,
		};
	}

	public getPermissionFromRights(rights: {
		canCreate: boolean;
		canUpdate: boolean;
		canDelete: boolean;
		canView: boolean;
		isAdmin: boolean;
		isSuperAdmin: boolean;
	}) {
		let permission = SystemPermissions.RIGHT_NONE;
		const { canCreate, canUpdate, canDelete, canView, isAdmin, isSuperAdmin } = rights;
		if (canCreate) permission |= SystemPermissions.RIGHT_CREATE;
		if (canUpdate) permission |= SystemPermissions.RIGHT_UPDATE;
		if (canDelete) permission |= SystemPermissions.RIGHT_DELETE;
		if (canView) permission |= SystemPermissions.RIGHT_READ;
		if (isAdmin) permission |= SystemPermissions.RIGHT_ADMIN;
		if (isSuperAdmin) permission |= SystemPermissions.RIGHT_SUPER_ADMIN;

		return permission;
	}
}
