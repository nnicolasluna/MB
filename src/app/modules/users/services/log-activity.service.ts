import { Injectable } from '@angular/core';
import { BaseParams, ListResponse } from '@shared/interfaces';
import { BaseHttpService } from '@shared/services';
import { LogActivity } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class LogActivityService extends BaseHttpService {
	constructor() {
		super('log-activities');
	}

	getAll(filters: BaseParams) {
		return this.http.get<ListResponse<LogActivity>>(this.namespace, { params: filters.toHttpParams() });
	}
}
