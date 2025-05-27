import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export abstract class BaseHttpService {
	private _apiUrl = environment.apiHost;
	protected http = inject(HttpClient);
	protected namespace;

	constructor(namespace: string, version: string = 'v1') {
		if (environment.apiPrefix) {
			this._apiUrl = `${this._apiUrl}/${environment.apiPrefix}`;
		}

		this.namespace = `${this._apiUrl}/${version}/${namespace}`;
	}
}
