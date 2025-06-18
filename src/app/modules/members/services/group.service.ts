import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';
import { GroupModel } from '../interfaces/user.interface';

@Injectable({
	providedIn: 'root',
})
export class GroupService extends BaseExistsService<GroupModel> {
	constructor() {
		super('group');
	}
}
