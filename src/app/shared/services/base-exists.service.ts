import { Injectable } from '@angular/core';
import { BaseCRUDHttpService } from './base-crud-http.service';

@Injectable({
	providedIn: 'root',
})
export abstract class BaseExistsService<T> extends BaseCRUDHttpService<T> {
	constructor(namespace: string, version: string = 'v1') {
		super(namespace, version);
	}

	exists(field: string, value: string) {
		return this.http.get(`${this.namespace}/exists`, { params: { field, value } });
	}
}
