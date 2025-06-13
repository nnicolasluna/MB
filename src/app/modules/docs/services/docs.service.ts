import { Injectable } from '@angular/core';
import { UserModel } from '@modules/users/interfaces';
import { BaseExistsService } from '@shared/services';

@Injectable({
	providedIn: 'root',
})
export class DocsService extends BaseExistsService<UserModel> {
	constructor() {
		super('docs');
	}
}
