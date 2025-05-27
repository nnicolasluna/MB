import { Injectable } from '@angular/core';
import { BaseCRUDHttpService } from '@shared/services';
import { Producer } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProducerService extends BaseCRUDHttpService<Producer> {
	constructor() {
		super('producers');
	}
}
