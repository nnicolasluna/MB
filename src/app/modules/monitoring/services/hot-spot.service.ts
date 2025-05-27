import { Injectable } from '@angular/core';
import { BaseCRUDHttpService } from '@shared/services';
import { HotSpot } from '../interfaces/hot-spot/hot-spot.interface';
import dayjs from 'dayjs';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})
export class HotSpotService extends BaseCRUDHttpService<HotSpot> {
	constructor() {
		super('hot-spot');
	}

	public getHotSpotGjson(startDate: Date, endDate: Date) {
		return this.http.get<any>(`${this.namespace}/gjson`, {
			params: {
				startDate: dayjs(startDate).format('YYYY-MM-DD'),
				endDate: dayjs(endDate).format('YYYY-MM-DD'),
			},
		});
	}

	public download(startDate: Date, endDate: Date) {
		return this.http.get<any>(`${this.namespace}/export`, {
			responseType: 'text' as 'json',
			params: {
				startDate: dayjs(startDate).format('YYYY-MM-DD'),
				endDate: dayjs(endDate).format('YYYY-MM-DD'),
			},
		});
	}

	public downloadFile(url: string) {
		const a = document.createElement('a');
		a.href = environment.apiHost + '/' + environment.apiPrefix + url;
		a.download = url.split('/').pop() || '';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
}
