import { inject, Injectable } from '@angular/core';
import { UserModel } from '@modules/users/interfaces';
import { BaseExistsService } from '@shared/services';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class SubDocsService extends BaseExistsService<any> {

	constructor() {
		super('subdocs');
	}
	uploadFile(formData: FormData) {
		return this.http.patch(`${this.namespace}/update-file`, formData);
	}
}
