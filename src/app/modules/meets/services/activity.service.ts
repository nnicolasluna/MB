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
}
