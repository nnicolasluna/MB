import { Injectable } from '@angular/core';
import { UserModel } from '../interfaces';
import { UserStatus } from '../constants';
import { BaseExistsService } from '@shared/services';

@Injectable({
	providedIn: 'root',
})
export class UserService extends BaseExistsService<UserModel> {
	constructor() {
		super('users');
	}

	updateStatus(id: number, status: UserStatus) {
		return this.http.patch(`${this.namespace}/update-status`, { id, status });
	}
}
