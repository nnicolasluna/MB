import { Role } from '../roles/role.interface';

export interface Permission {
	uuid: string;
	idRole: number;
	idResource: number;
	permission: number;
	role: Role;
	resource: Resource;
}

export interface Resource {
	id: number;
	name: string;
	code: string;
	type: string;
}
