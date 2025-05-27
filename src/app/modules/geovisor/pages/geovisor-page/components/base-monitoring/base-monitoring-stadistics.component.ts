import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectorRef } from '@angular/core';
import { GeovisorService } from '@modules/geovisor/services/geovisor.service';
import { StateService } from '@modules/geovisor/services/state.service';
import { TimelineService } from '@modules/geovisor/services/timeline.service';
import { BaseMonitoring } from '@modules/monitoring/interfaces/base-monitoring.interface';
import { ToastService } from '@shared/services';
import { geoJSON } from 'leaflet';
import { SelectChangeEvent } from 'primeng/select';

export type SettableStateField = keyof Omit<StateService, 'wmsUrl' | 'geoserverUrl'>;

@Component({
	template: '',
	standalone: false,
})
export abstract class BaseMonitoringStadisticsComponent<T extends BaseMonitoring> implements OnInit, OnDestroy {
	public isLoading = signal(false);
	protected _geovisorService = inject(GeovisorService);
	protected _geovisorState = inject(StateService);
	protected _cdr = inject(ChangeDetectorRef);
	protected _ts = inject(ToastService);
	protected timelineService = inject(TimelineService);

	protected legendColor = '#1240af';

	abstract service: any;
	abstract baseData: any;

	protected currentLayerField?: SettableStateField;
	protected monitoringType?: string;

	public selectedValue?: T;
	public onSelectedValueChange(event: SelectChangeEvent) {
		this.selectedValue = event.value;

		if (this.currentLayerField && this._geovisorState[this.currentLayerField] != null) {
			this._geovisorState.removeLayer(this._geovisorState[this.currentLayerField]);
			this._geovisorState[this.currentLayerField] = null;
		}

		this.timelineService.changeItem(event.value);

		this.loadData();
	}

	public selectedTab = 0;

	abstract ngOnInit(): void;

	abstract ngOnDestroy(): void;

	public provTotalArea = 0;
	public get provinces() {
		return this._geovisorState.provinces;
	}

	public munTotalArea = 0;
	public get municipalities() {
		return this._geovisorState.municipalities;
	}

	public apsTotalArea = 0;
	public get aps() {
		return this._geovisorState.apsList;
	}

	public tcosTotalArea = 0;
	public get tcos() {
		return this._geovisorState.tcosList;
	}

	public ramsarTotalArea = 0;
	public get ramsars() {
		return this._geovisorState.ramsarList;
	}

	public onTabChange(value: string | number) {
		this.selectedTab = Number(value);
		this.calculateData();
	}

	public calculateData() {
		setTimeout(() => {
			if (this.selectedTab == 0) {
				this.calculateProvData(this.provinces);
				this.calculateMunData(this.municipalities);
			} else if (this.selectedTab == 1) {
				this.calculateTcosData(this.tcos);
			} else if (this.selectedTab == 2) {
				this.calculateApsData(this.aps);
			} else if (this.selectedTab == 3) {
				this.calculateRamsarData(this.ramsars);
			}
		}, 100);
	}

	public calculateAreas() {
		for (let i = 0; i < this.baseData.length; i++) {
			if (this.baseData[i].mun) this.munTotalArea += this.baseData[i].sup;
			if (this.baseData[i].prov) this.provTotalArea += this.baseData[i].sup;
			if (this.baseData[i].aps) this.apsTotalArea += this.baseData[i].sup;
			if (this.baseData[i].tcos) this.tcosTotalArea += this.baseData[i].sup;
			if (this.baseData[i].ramsar) this.ramsarTotalArea += this.baseData[i].sup;
		}
	}

	public loadData() {
		this.isLoading.set(true);
		this.service.getStadistics(this.selectedValue!.uuid).subscribe({
			next: (res: any) => {
				this.baseData = res.data;
				this.calculateAreas();
				this._geovisorState.area.set(this.munTotalArea);
				this.calculateData();
				this.isLoading.set(false);
			},
			error: (err: any) => {
				console.error(err);
				this._ts.error('Error al cargar los datos');
				this.isLoading.set(false);
			},
		});
	}

	public onMonitoringChange(item: any) {
		this.selectedValue = item;
		this.loadData();
	}

	// INFO: Prov Data
	public provData: any = signal({});

	public calculateProvData(provinces: string[]) {
		const provData = provinces
			.map((prov) => {
				let quantity = 0;
				this.baseData.forEach((x: any) => {
					if (x.prov === prov) quantity += x.sup;
				});

				return {
					name: prov,
					value: quantity,
				};
			})
			.sort((a: any, b: any) => {
				return b.value - a.value;
			});

		let data: any = {};

		data.labels = provData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Superficie (ha)',
			backgroundColor: this.legendColor,
			data: provData.map((prov) => prov.value),
		});

		this.provData.set(data);
	}

	public onProvinceChange(items: string[]) {
		if (items.length === 0) this.calculateProvData(this.provinces);
		else this.calculateProvData(items);
	}

	//INFO: Mun Data
	public munData = signal({});

	public calculateMunData(municipalities: string[]) {
		const munData = municipalities
			.map((name) => {
				let quantity = 0;
				this.baseData.forEach((x: any) => {
					if (x.mun === name) quantity += x.sup;
				});

				return {
					name,
					value: quantity,
				};
			})
			.sort((a: any, b: any) => b.value - a.value);

		let data: any = {};

		data.labels = munData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Superficie (ha)',
			backgroundColor: this.legendColor,
			data: munData.map((prov) => prov.value),
		});

		this.munData.set(data);
	}

	public onMunicipalityChange(items: string[]) {
		if (items.length === 0) this.calculateMunData(this.municipalities);
		else this.calculateMunData(items);
	}

	// INFO: APS Data
	public apsData = signal({});

	public calculateApsData(aps: string[]) {
		const apsData = aps
			.map((name) => {
				let quantity = 0;
				this.baseData.forEach((x: any) => {
					if (x.aps === name) quantity += x.sup;
				});

				return {
					name,
					value: quantity,
				};
			})
			.sort((a: any, b: any) => b.value - a.value);

		let data: any = {};

		data.labels = apsData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Superficie (ha)',
			backgroundColor: this.legendColor,
			data: apsData.map((prov) => prov.value),
		});

		this.apsData.set(data);
	}

	public onApsChange(items: string[]) {
		if (items.length === 0) this.calculateApsData(this.aps);
		else this.calculateApsData(items);
	}

	//INFO: TCOS Data
	public tcosData = signal({});

	public calculateTcosData(tcos: string[]) {
		const tcosData = tcos
			.map((name) => {
				let quantity = 0;
				this.baseData.forEach((x: any) => {
					if (x.tcos === name) quantity += x.sup;
				});

				return {
					name,
					value: quantity,
				};
			})
			.sort((a: any, b: any) => b.value - a.value);

		let data: any = {};

		data.labels = tcosData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Superficie (ha)',
			backgroundColor: this.legendColor,
			data: tcosData.map((prov) => prov.value),
		});

		this.tcosData.set(data);
	}

	public onTcosChange(items: string[]) {
		if (items.length === 0) this.calculateTcosData(this.tcos);
		else this.calculateTcosData(items);
	}

	// INFO: Ramsar Data
	public ramsarData = signal({});

	public calculateRamsarData(ramsars: string[]) {
		const ramsarData = ramsars
			.map((name) => {
				let quantity = 0;
				this.baseData.forEach((x: any) => {
					if (x.ramsar === name) quantity += x.sup;
				});

				return {
					name,
					value: quantity,
				};
			})
			.sort((a: any, b: any) => b.value - a.value);

		let data: any = {};

		data.labels = ramsarData.map((x) => x.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Superficie (ha)',
			backgroundColor: this.legendColor,
			data: ramsarData.map((x) => x.value),
		});

		this.ramsarData.set(data);
	}

	public onRamsarChange(items: string[]) {
		if (items.length === 0) this.calculateRamsarData(this.ramsars);
		else this.calculateRamsarData(items);
	}

	public onDownloadCurrentValue() {
		if (!this.selectedValue) return;

		this._ts.info('Descargando cobertura de ' + (this.selectedValue as any).name);
		this.service.download(this.selectedValue).subscribe({
			next: (url: string) => this.service.downloadFile(url),
			error: () => this._ts.error('Error al descargar la cobertura'),
		});
	}

	public isQueryFeature = false;

	private getBarColorByType(type: 'mun' | 'prov' | 'tcos' | 'ramsar' | 'aps') {
		switch (type) {
			case 'mun':
			case 'prov':
				return '#d7b600';
			case 'aps':
				return 'rgb(123, 208, 77)';
			case 'tcos':
				return 'rgb(216, 201, 73)';
			case 'ramsar':
				return 'rgb(189,214,138)';
		}
	}

	public onBarClick(value: string, type: 'mun' | 'prov' | 'tcos' | 'ramsar' | 'aps') {
		if (this.isQueryFeature) return;
		this.isQueryFeature = true;
		this._geovisorService.getFeatureBbox(type, value).subscribe({
			next: (res: any) => {
				if (!res) return;
				const geojson = geoJSON(res, {
					style: {
						color: this.getBarColorByType(type),
						weight: 2,
						fillOpacity: 0.8,
					},
				});

				this._geovisorState.map?.addLayer(geojson);
				this._geovisorState.map?.fitBounds(geojson.getBounds(), { padding: [50, 50] });

				setTimeout(() => {
					this._geovisorState.map?.removeLayer(geojson);
				}, 3000);
				this.isQueryFeature = false;
			},
			error: (err: any) => {
				console.error(err);
				this._ts.error('Error al cargar el poligono');
				this.isQueryFeature = false;
			},
		});
	}

	public get isLayerSet() {
		return this._geovisorState[this.currentLayerField!] != null;
	}

	public onKeepLayer() {
		if (this.isLayerSet) {
			this._geovisorState.removeLayer(this._geovisorState[this.currentLayerField!]);
			this._geovisorState[this.currentLayerField!] = null;
		} else {
			this.selectedValue!.opacity = 1;
			this._geovisorState.addLayer(this.selectedValue, {
				mapType: this.monitoringType,
			});
			this._geovisorState[this.currentLayerField!] = this.selectedValue;
		}
	}

	public get opacityLayer(): number | undefined {
		return this._geovisorState[this.currentLayerField!]?.opacity;
	}

	public set opacityLayer(value: number) {
		if (this.currentLayerField && this._geovisorState[this.currentLayerField]) {
			this._geovisorState[this.currentLayerField].opacity = value;
			this._geovisorState[this.currentLayerField].tileMap.setOpacity(value);
		}
	}

	public onChangeMapOpacity(value: number) {
		this.opacityLayer = value;

		this.timelineService.setOpacity(value);
	}
}
