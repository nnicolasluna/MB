import { Injectable } from '@angular/core';
import { BaseCRUDHttpService } from '@shared/services';
import { environment } from '@environments/environment';
import { MonitoringRiskFire } from '../interfaces/monitoring-risk-fire/monitoring-risk-fire.interface';

@Injectable({
	providedIn: 'root',
})
export class MonitoringRiskFireService extends BaseCRUDHttpService<MonitoringRiskFire> {
	constructor() {
		super('monitoring-fire');
	}

	public download(map: MonitoringRiskFire) {
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
