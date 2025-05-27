import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '@environments/environment';
import { StateService } from '@modules/geovisor/services/state.service';
import { MapData } from '@modules/map-data/interfaces';
import { MapDataService } from '@modules/map-data/services/map-data.service';
import { ToastService } from '@shared/services';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { SliderChangeEvent, SliderModule } from 'primeng/slider';

@Component({
	selector: 'app-item-map',
	imports: [FormsModule, SliderModule, ButtonModule, PopoverModule],
	templateUrl: './item-map.component.html',
	styleUrl: './item-map.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemMapComponent {
	public item = input.required<MapData>();

	public baseImageUrl = `${environment.apiHost}/${environment.apiPrefix}/static`;

	private _ts = inject(ToastService);
	private _mapDataService = inject(MapDataService);
	private _geovisorState = inject(StateService);

	public onToggleMapClick(side?: 'left' | 'right') {
		if (this.item().isAdded) {
			this._geovisorState.removeMapData(this.item());
		} else {
			if (side) this._geovisorState.addMapData(this.item(), side);
			else this._geovisorState.addMapData(this.item());
		}
	}

	public onChangeMapOpacity(event: SliderChangeEvent) {
		if (!event.value) return;
		this.item().tileMap?.setOpacity(event.value);
	}

	public onDownloadMapClick() {
		this._ts.info('Descargando cobertura...');
		if (this.item().typeGeom == 'Raster') {
			this.downloadRaster(this.item());
		} else {
			this._mapDataService.download(this.item()).subscribe({
				next: (url) => this._mapDataService.downloadFile(url),
				error: () => this._ts.error('Error al descargar la cobertura'),
			});
		}
	}

	public get wmsUrl() {
		const geoserverUrl = environment.urlGeoserver.endsWith('/')
			? environment.urlGeoserver.slice(0, -1)
			: environment.urlGeoserver;
		return `${geoserverUrl}/${environment.workspaceGeoserver}/wms`;
	}

	public downloadRaster(map: MapData) {
		const { bboxImage, nameImage, srsImage } = map;

		const aspectRatio = Math.abs(bboxImage.maxx - bboxImage.minx) / Math.abs(bboxImage.maxy - bboxImage.miny);

		const width = 1000;
		const height = Math.round(width / aspectRatio);

		const bbox = `${bboxImage.minx},${bboxImage.miny},${bboxImage.maxx},${bboxImage.maxy}`;

		const url = `${this.wmsUrl}?service=WMS&version=1.1.0&request=GetMap&layers=a_${nameImage}&bbox=${bbox}&width=${width}&height=${height}&srs=${srsImage}&style=&format=image/geotiff`;

		window.open(url, '_blank');
	}

	public isSideVisible = computed(() => {
		return this._geovisorState.isSideVisible();
	});
}
