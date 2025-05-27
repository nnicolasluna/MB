import { Injectable } from '@angular/core';
import { BaseCRUDHttpService } from '@shared/services';
import { environment } from '@environments/environment';
import { MonitoringSoil } from '../interfaces/monitoring-soil/monitoring-soil.interface';

@Injectable({
	providedIn: 'root',
})
export class MonitoringSoilService extends BaseCRUDHttpService<MonitoringSoil> {
	constructor() {
		super('monitoring-soil');
	}

	public download(map: MonitoringSoil) {
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
}
