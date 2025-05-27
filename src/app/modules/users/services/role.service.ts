import { Injectable } from '@angular/core';
import { Role } from '../interfaces';
import { BaseExistsService } from '@shared/services';

@Injectable({
	providedIn: 'root',
})
export class RoleService extends BaseExistsService<Role> {
	constructor() {
		super('roles');
	}
}
