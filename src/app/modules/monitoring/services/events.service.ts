import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';

@Injectable({
	providedIn: 'root',
})
export class EventService extends BaseExistsService<any> {
	constructor() {
		super('activity');
	}
	fechas() {
		return this.http.get<any>(`${this.namespace}/fechas`);
	}
}
