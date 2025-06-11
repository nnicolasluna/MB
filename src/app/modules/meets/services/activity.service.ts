import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';
import { ActivityModel } from '../interfaces/activity.interface';

@Injectable({
	providedIn: 'root',
})
export class ActivityService extends BaseExistsService<ActivityModel> {
	constructor() {
		super('activity');
	}
}
