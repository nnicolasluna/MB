import { Injectable } from '@angular/core';
import { BaseCRUDHttpService } from '@shared/services/base-crud-http.service';
import { Permission, Resource } from '../interfaces/permissions/permission.interface';

@Injectable({
	providedIn: 'root',
})
export class PermissionService extends BaseCRUDHttpService<Permission> {
	constructor() {
		super('permissions');
	}

	updatePermission(permission: { idRole: number; idResource: number; permission: number }) {
		return this.http.put<Permission>(`${this.namespace}/`, permission);
	}

	getResources(idRole?: number) {
		if (!idRole) {
			return this.http.get<Resource[]>(`${this.namespace}/resources`);
		}
		return this.http.get<Resource[]>(`${this.namespace}/resources`, { params: { idRole: idRole.toString() } });
	}

	getOne(roleId: number, resourceId: number) {
		return this.http.get<Permission>(`${this.namespace}/${roleId}/${resourceId}`);
	}

	deletePermission(roleId: number, resourceId: number) {
		return this.http.delete<boolean>(`${this.namespace}/${roleId}/${resourceId}`);
	}
}
