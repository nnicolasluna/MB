import { inject, Injectable } from '@angular/core';
import { UserModel } from '@modules/users/interfaces';
import { BaseExistsService } from '@shared/services';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class WorkingDocsService extends BaseExistsService<any> {

	constructor() {
		super('working-docs');
	}
	uploadFile(formData: FormData) {
		return this.http.post(`${this.namespace}/update-file`, formData);
	}
}
