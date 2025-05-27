import { Injectable } from '@angular/core';
import { MapData, MapDataParams } from '@modules/map-data/interfaces';
import { MonitoringBurn } from '@modules/monitoring/interfaces/monitoring-burn/monitoring-burn.interface';
import { MonitoringRiskFire } from '@modules/monitoring/interfaces/monitoring-risk-fire/monitoring-risk-fire.interface';
import { MonitoringSoil } from '@modules/monitoring/interfaces/monitoring-soil/monitoring-soil.interface';
import { MonitoringUse } from '@modules/monitoring/interfaces/monitoring-use/monitoring-use.interface';
import { MonitoringWater } from '@modules/monitoring/interfaces/monitoring-water/monitoring-water.interface';
import { ListResponse } from '@shared/interfaces';
import { BaseHttpService } from '@shared/services';
import { ArcheologicalSite } from '../interfaces/archeological-site.interface';

@Injectable({
	providedIn: 'root',
})
export class GeovisorService extends BaseHttpService {
	constructor() {
		super('geovisor');
	}

	public getMapData(filter: MapDataParams) {
		return this.http.get<ListResponse<MapData>>(`${this.namespace}/map-data`, {
			params: filter.toHttpParams(),
		});
	}

	public getMonitoringWater() {
		return this.http.get<ListResponse<MonitoringWater>>(`${this.namespace}/monitoring/water`);
	}

	public getMonitoringRisk() {
		return this.http.get<ListResponse<MonitoringRiskFire>>(`${this.namespace}/monitoring/risk`);
	}

	public getMonitoringBurn() {
		return this.http.get<ListResponse<MonitoringBurn>>(`${this.namespace}/monitoring/burn`);
	}

	public getMonitoringSoil() {
		return this.http.get<ListResponse<MonitoringSoil>>(`${this.namespace}/monitoring/soil`);
	}

	public getSoilAlerts() {
		return this.http.get<ListResponse<MonitoringSoil>>(`${this.namespace}/monitoring/soil-alerts`);
	}

	public getMonitoringUse() {
		return this.http.get<ListResponse<MonitoringUse>>(`${this.namespace}/monitoring/use`);
	}

	public getLastHotSpotUpdate() {
		return this.http.get<string>(`${this.namespace}/hot-spot/last`);
	}

	public getLayersData(filter: { ids: string; lat: number; lng: number; zoom: number }) {
		return this.http.get<any>(
			this.namespace + `/data?lat=${filter.lat}&lng=${filter.lng}&zoom=${filter.zoom}&${filter.ids}`,
		);
	}

	public getArcheologicalSites() {
		return this.http.get<ArcheologicalSite[]>(this.namespace + '/archelogical-sites');
	}

	public getFeatureBbox(prop: string, value: string) {
		return this.http.get<any>(this.namespace + `/feature-bbox?prop=${prop}&value=${value}`);
	}
}
