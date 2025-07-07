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
		return this.http.post(`${this.namespace}/update-file`, formData);
	}
	downloadFile(filename: string, token: string) {
		return this.http.get(`${this.namespace}/download/${filename}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			responseType: 'blob',
		});
	}
	downloadFileExterno(filename: string) {
		return this.http.get(`${this.namespace}/download-externo/${filename}`, {
			responseType: 'blob',
		});
	}
}
