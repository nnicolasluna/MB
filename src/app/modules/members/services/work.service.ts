import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';
import { GroupModel } from '../interfaces/user.interface';

@Injectable({
	providedIn: 'root',
})
export class WorkService extends BaseExistsService<GroupModel> {
	constructor() {
		super('work');
	}

	getOne(id: number) {
		return this.http.get<any>(`${this.namespace}/${id}`);
	}
}
