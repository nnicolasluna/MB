import { Injectable } from '@angular/core';
import { BaseParams } from '@shared/interfaces';
import { BaseExistsService } from '@shared/services';

@Injectable({
	providedIn: 'root',
})
export class EventService extends BaseExistsService<any> {
	constructor() {
		super('activity');
	}
	fechas(filters: BaseParams) {
		return this.http.get<any>(`${this.namespace}/fechas`, { params: filters.toHttpParams() });
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
	updateList(id: number, data: any) {
		return this.http.put(`${this.namespace}/list/${id}`, data);
	}
	updateActa(id: number, data: any) {
		return this.http.put(`${this.namespace}/acta/${id}`, data);
	}
	downloadexterno(filename: string) {
		return this.http.get(`${this.namespace}/download-externo/${filename}`, {
			responseType: 'blob',
		});
	}
}
