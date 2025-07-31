import { Injectable } from '@angular/core';
import { UserModel } from '@modules/users/interfaces';
import { BaseExistsService } from '@shared/services';

@Injectable({
	providedIn: 'root',
})
export class folderService extends BaseExistsService<any> {
	constructor() {
		super('folder');
	}
}
