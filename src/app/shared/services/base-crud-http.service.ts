import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { ListResponse, BaseParams } from '@shared/interfaces';

@Injectable({
	providedIn: 'root',
})
export abstract class BaseCRUDHttpService<T> extends BaseHttpService {
	constructor(namespace: string, version: string = 'v1') {
		super(namespace, version);
	}

	getAll(filters: BaseParams) {
		return this.http.get<ListResponse<T>>(this.namespace, { params: filters.toHttpParams() });
	}

	getById(id: number | string) {
		return this.http.get<T>(`${this.namespace}/${id}`);
	}
	getByIdPaginate(id: number | string, filters: BaseParams) {
		return this.http.get<ListResponse<T>>(`${this.namespace}/${id}`, { params: filters.toHttpParams() });
	}

	getByCode(code: string) {
		return this.http.get<T>(`${this.namespace}/code/${code}`);
	}

	create(data: any) {
		return this.http.post<T>(this.namespace, data);
	}

	update(id: number, data: Partial<T> | FormData) {
		return this.http.put<T>(`${this.namespace}/${id}`, data);
	}

	delete(id: number) {
		return this.http.delete<boolean>(`${this.namespace}/${id}`);
	}
}
