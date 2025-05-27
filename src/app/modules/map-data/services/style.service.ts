import { BaseExistsService } from '@shared/services';
import { Style } from '../interfaces/style/style.interface';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class StyleService extends BaseExistsService<Style> {
	constructor() {
		super('map-styles');
	}
}
