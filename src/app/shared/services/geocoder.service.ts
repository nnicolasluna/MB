import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';

@Injectable({
	providedIn: 'root',
})
export class GeocoderService extends BaseHttpService {
	constructor() {
		super('geocoder');
	}

	getRegionLimits() {
		return this.http.get<{ limits: any; aps: any; tcos: any; ramsar: any }>(`${this.namespace}/region-limits`);
	}
}
