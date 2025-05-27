import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';
import { MapData } from '../interfaces';
import { environment } from '@environments/environment';
import { BaseParams, ListResponse } from '@shared/interfaces';

@Injectable({
	providedIn: 'root',
})
export class MapDataService extends BaseExistsService<MapData> {
	constructor() {
		super('map-data');
	}

	public download(mapData: MapData) {
		return this.http.get<string>(`${this.namespace}/export/${mapData.uuid}`, { responseType: 'text' as 'json' });
	}

	public downloadFile(url: string) {
		const a = document.createElement('a');
		a.href = environment.apiHost + '/' + environment.apiPrefix + url;
		a.download = url.split('/').pop() || '';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	public uploadFile(data: FormData) {
		return this.http.post<number>(`${this.namespace}/upload`, data);
	}

	public getAllPublic(filter: BaseParams) {
		return this.http.get<ListResponse<MapData>>(`${this.namespace}/public`, { params: filter.toHttpParams() });
	}

	public getPublicData(filter: { ids: string; lat: number; lng: number; zoom: number }) {
		return this.http.get<{ name: string; data: any }[]>(`${this.namespace}/public/data`, { params: filter });
	}

	public saveRasterFile(formData: FormData) {
		// let headers = new HttpHeaders().set('Token', this.credentialsService.getToken());
		return this.http.post(`${this.namespace}/upload-satellite-image`, formData);
	}

	public deleteRaster(id: number) {
		return this.http.delete(`${this.namespace}/satellite-image/${id}`);
	}
}
