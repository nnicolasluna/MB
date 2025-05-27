import { Component, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { circleMarker } from 'leaflet';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { HotSpotService } from '@modules/monitoring/services/hot-spot.service';
import { SelectModule } from 'primeng/select';
import { BaseMonitoringStadisticsComponent } from '../base-monitoring/base-monitoring-stadistics.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'app-geo-hot-spots',
	imports: [
		DecimalPipe,
		ReactiveFormsModule,
		FormsModule,
		ChartModule,
		MultiSelectModule,
		ButtonModule,
		DatePickerModule,

		SelectModule,
		TabsModule,

		BarChartComponent,
		LoaderComponent,
	],
	templateUrl: './geo-hot-spots.component.html',
	styleUrl: './geo-hot-spots.component.scss',
})
export class GeoHotSpotsComponent extends BaseMonitoringStadisticsComponent<any> {
	override service: any = inject(HotSpotService);
	override baseData: any;

	override ngOnDestroy(): void {
		this._geovisorState.isHotSpotTab.set(false);
	}

	public totalHotSpots = signal(0);

	public rangeDate?: Date[] = [new Date(), new Date()];

	public set isHotSpotActive(value: boolean) {
		this._geovisorState.isHotSpotActive.set(value);
	}

	public get isHotSpotActive() {
		return this._geovisorState.isHotSpotActive();
	}

	public override ngOnInit(): void {
		this._geovisorState.isHotSpotTab.set(true);
		this.loadData();
	}

	public activeHotSpot() {
		this.isHotSpotActive = true;
		this._geovisorState.hotSpots.clearLayers();

		this.updateHotSpotsLayer();

		if (!this._geovisorState.map?.hasLayer(this._geovisorState.hotSpots))
			this._geovisorState.map?.addLayer(this._geovisorState.hotSpots);

		if (!this._geovisorState._legendControl?.getVisibility()) this._geovisorState._legendControl?.setVisibility(true);
	}

	public processQuery() {
		this.loadData();
	}

	public onDownload() {
		this._ts.info('Descargando...');
		this.service.download(this.rangeDate![0], this.rangeDate![1]).subscribe({
			next: (url: string) => this.service.downloadFile(url),
			error: () => this._ts.error('Error al descargar'),
		});
	}

	private getColorOfSatellite(satellite: string): string {
		switch (satellite) {
			case 'modis_c6_1':
				return '#2563eb';
			case 'suomi_viirs_c2':
				return '#7c3aed';
			case 'j1_viirs_c2':
				return '#ea580c';
			case 'j2_viirs_c2':
				return '#db2777';
			default:
				return '#000000';
		}
	}

	public updateHotSpotsLayer() {
		this._geovisorState.hotSpots.clearLayers();
		this._geovisorState.hotSpots.addLayers(
			this._geovisorState.hotSpotsRaw.features.map((f: any) => {
				return circleMarker([f.geometry.coordinates[1], f.geometry.coordinates[0]], {
					radius: 5,
					fillColor: this.getColorOfSatellite(f.properties.satelite),
					fillOpacity: 0.8,
					weight: 1,
				}).bindPopup(
					`<div class="popup">
							<p><strong>Fecha:</strong> ${f.properties.acq_date ?? ''}</p>
							<p><strong>Hora UTC:</strong> ${f.properties.acq_time ?? ''}</p>
							<p><strong>Municipio:</strong> ${f.properties.mun ?? ''}</p>
							<p><strong>Provincia:</strong> ${f.properties.prov ?? ''}</p>
							<p><strong>TCOS:</strong> ${f.properties.tcos ?? ''}</p>
							<p><strong>APS:</strong> ${f.properties.aps ?? ''}</p>
							<p><strong>Ramsar:</strong> ${f.properties.ramsar ?? ''}</p>
							<p><strong>Satelite:</strong> ${f.properties.satelite ?? ''}</p>
							<p><strong>Latitud:</strong> ${f.properties.latitude ?? ''}</p>
							<p><strong>Longitud:</strong> ${f.properties.longitude ?? ''}</p>
						</div>`,
				);
			}),
		);
	}

	public deactiveHotSpot() {
		this.isHotSpotActive = false;
		if (this._geovisorState.map?.hasLayer(this._geovisorState.hotSpots))
			this._geovisorState.map?.removeLayer(this._geovisorState.hotSpots);
		if (this._geovisorState.activeMaps().length === 0) this._geovisorState._legendControl?.setVisibility(false);
	}

	public override loadData() {
		this.isLoading.set(true);
		this.service.getHotSpotGjson(this.rangeDate![0], this.rangeDate![1]).subscribe({
			next: (res: any) => {
				this._geovisorState.hotSpotsRaw = res;
				this.calculateProvData(this.provinces);
				this.calculateMunData(this.municipalities);

				this.totalHotSpots.set(res.features.length);
				this.activeHotSpot();
				// this.updateHotSpotsLayer();
				this.isLoading.set(false);
			},
			error: (err: any) => {
				this.isLoading.set(false);
				console.error(err);
				this._ts.error('Error al cargar los datos');
			},
		});
	}

	public override calculateProvData(provinces: string[]) {
		const provData = provinces
			.map((prov) => {
				const provHotSpots = this._geovisorState.hotSpotsRaw.features.filter((hotSpot: any) => {
					return hotSpot.properties.prov === prov;
				});
				return {
					prov,
					quantity: provHotSpots.length,
				};
			})
			.sort((a, b) => b.quantity - a.quantity);

		let data: any = {};

		data.labels = provData.map((prov) => prov.prov);
		data.datasets = [];
		data.datasets.push({
			label: 'Focos de Calor',
			backgroundColor: this.getColors(provData),
			data: provData.map((prov) => prov.quantity),
		});

		this.provData.set(data);
	}

	public getColors(provData: any[]) {
		const colors = provData.map((prov) => {
			if (prov.quantity > 0 && prov.quantity < 10) {
				return '#16a34a';
			} else if (prov.quantity > 9 && prov.quantity <= 100) {
				return '#ca8a04';
			} else if (prov.quantity > 100) {
				return '#dc2626';
			}
			return '#16a34a';
		});
		return colors;
	}

	//INFO: Mun Data
	public override calculateMunData(municipalities: string[]) {
		const munData = municipalities
			.map((mun) => {
				const hotSpots = this._geovisorState.hotSpotsRaw.features.filter((hotSpot: any) => {
					return hotSpot.properties.mun === mun;
				});
				return {
					prov: mun,
					quantity: hotSpots.length,
				};
			})
			.sort((a, b) => b.quantity - a.quantity);

		let data: any = {};

		data.labels = munData.map((prov) => prov.prov);
		data.datasets = [];
		data.datasets.push({
			label: 'Focos de Calor',
			backgroundColor: this.getColors(munData),
			data: munData.map((prov) => prov.quantity),
		});

		this.munData.set(data);
	}

	// INFO: APS Data
	public override calculateApsData(aps: string[]) {
		const apsData = aps
			.map((aps) => {
				const hotSpots = this._geovisorState.hotSpotsRaw.features.filter((hotSpot: any) => {
					return hotSpot.properties.aps === aps;
				});
				return {
					prov: aps,
					quantity: hotSpots.length,
				};
			})
			.sort((a, b) => b.quantity - a.quantity);

		let data: any = {};

		data.labels = apsData.map((prov) => prov.prov);
		data.datasets = [];
		data.datasets.push({
			label: 'Focos de Calor',
			backgroundColor: this.getColors(apsData),
			data: apsData.map((prov) => prov.quantity),
		});

		this.apsData.set(data);
	}

	//INFO: TCOS Data
	public override calculateTcosData(tcos: string[]) {
		const tcosData = tcos
			.map((tco) => {
				const hotSpots = this._geovisorState.hotSpotsRaw.features.filter((hotSpot: any) => {
					return hotSpot.properties.tcos === tco;
				});
				return {
					prov: tco,
					quantity: hotSpots.length,
				};
			})
			.sort((a, b) => b.quantity - a.quantity);

		let data: any = {};

		data.labels = tcosData.map((prov) => prov.prov);
		data.datasets = [];
		data.datasets.push({
			label: 'Focos de Calor',
			backgroundColor: this.getColors(tcosData),
			data: tcosData.map((prov) => prov.quantity),
		});

		this.tcosData.set(data);
	}

	// INFO: Ramsar Data
	public override calculateRamsarData(ramsars: string[]) {
		const ramsarData = ramsars
			.map((tco) => {
				const hotSpots = this._geovisorState.hotSpotsRaw.features.filter((hotSpot: any) => {
					return hotSpot.properties.ramsar === tco;
				});
				return {
					prov: tco,
					quantity: hotSpots.length,
				};
			})
			.sort((a, b) => b.quantity - a.quantity);

		let data: any = {};

		data.labels = ramsarData.map((prov) => prov.prov);
		data.datasets = [];
		data.datasets.push({
			label: 'Focos de Calor',
			backgroundColor: this.getColors(ramsarData),
			data: ramsarData.map((prov) => prov.quantity),
		});

		this.ramsarData.set(data);
	}
}
