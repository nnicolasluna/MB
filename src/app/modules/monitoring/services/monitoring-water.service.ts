import { Injectable } from '@angular/core';
import { BaseCRUDHttpService } from '@shared/services';
import { MonitoringWater } from '../interfaces/monitoring-water/monitoring-water.interface';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})
export class MonitoringWaterService extends BaseCRUDHttpService<MonitoringWater> {
	constructor() {
		super('monitoring-water');
	}

	public download(map: MonitoringWater) {
		return this.http.get<string>(`${this.namespace}/export/${map.uuid}`, { responseType: 'text' as 'json' });
	}

	public downloadFile(url: string) {
		const a = document.createElement('a');
		a.href = environment.apiHost + '/' + environment.apiPrefix + url;
		a.download = url.split('/').pop() || '';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	public updateStatus(data: { uuid: string; coverageState: string }) {
		return this.http.patch(`${this.namespace}/${data.uuid}/status`, {
			status: data.coverageState,
		});
	}

	public getStadistics(uuid?: string) {
		const params: any = {
			uuid,
		};

		return this.http.get(`${this.namespace}/stadistics`, {
			params,
		});
	}

	public getYearResume() {
		return this.http.get(`${this.namespace}/resume-years`);
	}

	public getDifference(uuid: string, uuid2: string) {
		return this.http.get(`${this.namespace}/difference/${uuid}/${uuid2}`);
	}
}
