import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';
import { ActivityModel } from '../interfaces/activity.interface';

@Injectable({
	providedIn: 'root',
})
export class ActivityService extends BaseExistsService<any> {
	constructor() {
		super('activity');
	}
	uploadFile(formData: FormData) {
		return this.http.post(`${this.namespace}/update-file`, formData);
	}
	uploadFileList(formData: FormData) {
		return this.http.post(`${this.namespace}/update-file-list`, formData);
	}
	updateList(id: number, data: any) {
		return this.http.put(`${this.namespace}/list/${id}`, data);
	}
	updateActa(id: number, data: any) {
		return this.http.put(`${this.namespace}/acta/${id}`, data);
	}
	downloadFile(filename: string, token: string) {
		return this.http.get(`${this.namespace}/download/${filename}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			responseType: 'blob',
		});
	}
	downloadFileList(filename: string, token: string) {
		return this.http.get(`${this.namespace}/download-list/${filename}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			responseType: 'blob',
		});
	}
}
