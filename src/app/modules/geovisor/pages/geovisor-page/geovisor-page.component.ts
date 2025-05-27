import { ChangeDetectionStrategy, Component, computed, inject, model, signal, viewChild } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { BASE_LAYERS, MAP_CENTER } from '@shared/constants';
import {
	Control,
	control,
	geoJSON,
	geoJson,
	LatLng,
	latLng,
	Layer,
	LeafletMouseEvent,
	Map,
	MapOptions,
	Popup,
	tileLayer,
	WMSOptions,
} from 'leaflet';
import { RouterLink } from '@angular/router';
import { ToggleItemControl } from '@modules/geovisor/controls/toggle-item.control';
import { PositionControl } from '@modules/geovisor/controls';
import { GeocoderService, ToastService } from '@shared/services';
import { DialogModule } from 'primeng/dialog';
import { MenuComponent } from './components/menu/menu.component';
import { GeoSidebarComponent } from './components/geo-sidebar/geo-sidebar.component';
import { ActiveMap, StateService } from '@modules/geovisor/services/state.service';
import { environment } from '@environments/environment';
import { OrderListModule } from 'primeng/orderlist';
import { firstValueFrom } from 'rxjs';
import { Image } from 'primeng/image';
import { SelectModule } from 'primeng/select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TimelineComponent } from './components/timeline/timeline.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { GeovisorService } from '@modules/geovisor/services/geovisor.service';
import { ArcheologicalSite } from '@modules/geovisor/interfaces/archeological-site.interface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SideBySideControl } from '@modules/geovisor/controls/swipe.control';
import { Popover, PopoverModule } from 'primeng/popover';
import { SortLayersComponent } from './components/sort-layers/sort-layers.component';

@Component({
	selector: 'app-geovisor-page',
	imports: [
		SortLayersComponent,
		PopoverModule,
		DatePipe,
		TimelineComponent,
		ButtonModule,
		RouterLink,
		CarouselModule,
		FormsModule,
		AutoCompleteModule,
		MenuComponent,
		GeoSidebarComponent,
		LeafletModule,
		SelectModule,
		DialogModule,
		OrderListModule,
		Image,
		PdfViewerModule,
		DecimalPipe,
	],
	templateUrl: './geovisor-page.component.html',
	styleUrl: './geovisor-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeovisorPageComponent {
	private _map?: Map;

	private _geovisorService = inject(GeovisorService);
	private _geocoderService = inject(GeocoderService);
	private _ts = inject(ToastService);
	public _geovisorState = inject(StateService);
	public isLoading = signal(true);

	public mapOptions: MapOptions = {
		zoom: 6,
		minZoom: 3,
		maxZoom: 18,
		center: latLng(MAP_CENTER[0], MAP_CENTER[1]),
	};

	private _layerControl?: Control.Layers;

	constructor() {
		const element = document.querySelector('html');
		element?.classList.remove('dark');
	}

	public lastHostSpotUpdate: string = '';

	public onMapReady(map: Map) {
		this._map = map;
		this._map.createPane('left');
		this._map.createPane('right');

		this._geovisorService.getLastHotSpotUpdate().subscribe({
			next: (res) => {
				this.lastHostSpotUpdate = res;
			},
			error: (err) => {
				console.error(err);
			},
		});

		this._geovisorState.map = map;
		map.removeControl(map.zoomControl);

		const baseLayers: { [name: string]: Layer } = BASE_LAYERS.reduce(
			(acc, layer) => ({
				...acc,
				[layer.name]: tileLayer(layer.url, {
					...(layer.subdomains?.length && { subdomains: layer.subdomains }),
				}),
			}),
			{},
		);

		const initialLayers = {};

		this._layerControl = control.layers(baseLayers, initialLayers, {
			position: 'topright',
			collapsed: true,
		});

		this._geovisorState.addLayerControl(this._layerControl);
		this._geovisorState.addLegendControl(this._toggleLegendControl);

		const baseLayer = baseLayers[BASE_LAYERS[0].name];
		// const leftLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		// 	pane: 'left',
		// }).addTo(map);
		// const rightLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		// 	pane: 'right',
		// }).addTo(map);

		baseLayer.addTo(this._map);

		this.getLimitGeoJson().then((limitGeoJson) => {
			this._geovisorState.regionLimits = limitGeoJson;
			map.addLayer(limitGeoJson);
			map.fitBounds(limitGeoJson.getBounds());
			this._layerControl?.addOverlay(limitGeoJson, 'Límites');

			const opts: WMSOptions = {
				layers: `sitios_ramsar`,
				format: 'image/png',
				transparent: true,
				version: '1.3.0',
				styles: 'sitios_ramsar',
			};

			this._layerControl?.addOverlay(tileLayer.wms(this.wmsUrl, opts), 'Sitios Ramsar');
			opts.styles = 'tcos';
			opts.layers = `tcos_moxos`;
			this._layerControl?.addOverlay(tileLayer.wms(this.wmsUrl, opts), 'TCOS');
			opts.styles = 'aps';
			opts.layers = `aps_moxos`;
			this._layerControl?.addOverlay(tileLayer.wms(this.wmsUrl, opts), 'Áreas Protegidas');

			const side = new SideBySideControl([], []);
			this._geovisorState.side = side;
			baseLayer.addTo(map);

			this.isLoading.set(false);
			this.addControlsToMap();
		});
	}

	get wmsUrl() {
		const geoserverUrl = environment.urlGeoserver.endsWith('/')
			? environment.urlGeoserver.slice(0, -1)
			: environment.urlGeoserver;
		return `${geoserverUrl}/${environment.workspaceGeoserver}/wms`;
	}

	private async getLimitGeoJson() {
		const regionLimits = await firstValueFrom(this._geocoderService.getRegionLimits());

		const limits = regionLimits.limits;

		this._geovisorState.regionLimitsRaw = limits;
		this._geovisorState.provinces = [
			...new Set<string>(limits.features.map((feature: any) => feature.properties.prov)),
		];
		this._geovisorState.municipalities = limits.features.map((feature: any) => feature.properties.mun);

		const aps = regionLimits.aps;

		this._geovisorState.apsRaw = aps;
		this._geovisorState.apsList = [...new Set<string>(aps.map((feature: any) => feature.aps))];

		const tcos = regionLimits.tcos;

		this._geovisorState.tcosRaw = tcos;
		this._geovisorState.tcosList = [...new Set<string>(tcos.map((feature: any) => feature.tcos))];

		const ramsar = regionLimits.ramsar;

		this._geovisorState.ramsarRaw = ramsar;
		this._geovisorState.ramsarList = [...new Set<string>(ramsar.map((feature: any) => feature.ramsar))];

		this._geovisorState.regionLimitsRaw = limits;

		return geoJson(limits, {
			style: { color: 'black', fillOpacity: 0, weight: 1 },
			onEachFeature: (feature: any, layer: any) => {
				if (feature?.properties?.mun) {
					layer.bindTooltip(feature.properties.mun, {
						permanent: true,
						direction: 'center',
						className: 'tooltip',
						pane: 'tooltipPane',
					});
				}

				layer.on({
					mouseout: () => layer.setStyle({ fillColor: 'transparent' }),
					mouseover: () => {
						layer.setStyle({
							fillColor: 'black',
							fillOpacity: 0.3,
						});
					},
					click: (e: any) => {
						this._geovisorState.map?.fitBounds(e.target.getBounds());
					},
				});
			},
		});
	}

	private _parseData(layerData: { name: string; data: any }[]) {
		const res = document.createElement('div');
		res.classList.add('layer-data');
		layerData.forEach((layer) => {
			const content = document.createElement('details');
			content.classList.add('layer-data__content');
			const { name, data } = layer;

			for (const d of data) {
				const keys = Object.keys(d);
				content.innerHTML = `<summary>${name}</summary>`;
				keys.forEach((key) => {
					const value = d[key];
					const element = document.createElement('p');
					element.innerHTML = `<strong>${key}</strong>: ${value}`;
					content.appendChild(element);
				});
			}

			res.appendChild(content);
		});

		return res;
	}

	private showWindy = false;
	private _windyToggleControl: ToggleItemControl = new ToggleItemControl(
		(value) => {
			this.showWindy = value;
			if (value) this._ts.info('Para desactivar vuelva a precionar el botón de Windy.');
		},
		{
			title: 'Mostrar/Ocultar Windy',
			iconOn: 'pi pi-cloud',
			iconOff: 'pi pi-cloud',
			position: 'topright',
		},
	);

	public async onMapClick(event: LeafletMouseEvent) {
		if (this.showWindy) {
			const popup = new Popup();
			popup.setLatLng(event.latlng);
			popup.options.className += ' windy-popup';
			popup.setContent(
				`<iframe width="600" height="450" src="https://embed.windy.com/embed2.html?lat=${event.latlng.lat}&lon=${event.latlng.lng}&detailLat=${event.latlng.lat}&detailLon=${event.latlng.lng}&width=600&height=450&zoom=${this._geovisorState.map?.getZoom() ?? 12}&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1" frameborder="0"></iframe>`,
			);
			this._map?.openPopup(popup);
		}

		const ids = this._geovisorState.activeMaps().reduce((acc, curr) => {
			if (!acc[curr.mapType!]) {
				acc[curr.mapType!] = [];
			}

			acc[curr.mapType!].push(curr.mapDataId);
			return acc;
		}, {} as any);

		delete ids['raster'];

		let strIds = '';

		for (const key in ids) {
			strIds += `${key}=${ids[key].join(',')}&`;
		}

		if (!this._geovisorState.isSideVisible()) {
			this.getLayerData(strIds, event.latlng, this._map?.getZoom());
		}
	}

	private getLayerData(ids: string, latlng: LatLng, zoom: any) {
		this._geovisorService
			.getLayersData({
				ids,
				lat: latlng.lat,
				lng: latlng.lng,
				zoom: zoom || 0,
			})
			.subscribe((data) => {
				if (!data.length) return;
				const content = this._parseData(data);

				const popup = new Popup(latlng, { content });

				this._map?.openPopup(popup);
			});
	}

	private _toggleLegendControl: ToggleItemControl = new ToggleItemControl(
		(value) => {
			if (this._geovisorState.isHotSpotActive()) {
				this.isLegendVisible.set(value);
				return;
			}

			if (this._geovisorState.activeMaps().length === 0 && value) {
				this._toggleLegendControl.setVisibility(false);
				this._ts.warn('Active un mapa primero para mostrar el panel de leyendas.');
				return;
			}
			this.isLegendVisible.set(value);
		},
		{
			position: 'topright',
			title: 'Mostrar/Ocultar Leyendas',
			iconOn: 'pi pi-palette',
			iconOff: 'pi pi-palette',
		},
	);
	public isLegendVisible = model(this._toggleLegendControl.getVisibility());

	public gpsShowErrorMessage(message: string) {
		this._ts.error(message);
	}

	private addControlsToMap() {
		const controls = [
			new Control.Zoom({ position: 'topright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }),
			this._layerControl!,
			this._toggleLegendControl,
			new PositionControl(),
			this._toggleSortControl,
			this._windyToggleControl,
			this._toggleArcheologicalSitesControl,
			this._toggleTermsControl,
			this._swipeToggleControl,
		];

		controls.forEach((control: Control) => {
			control.addTo(this._map!);
		});
	}

	public currentLayers = computed<ActiveMap[]>(() => {
		const activeMaps = this._geovisorState.activeMaps();
		return activeMaps;
	});

	imgUrl = `${environment.urlGeoserver}/${environment.workspaceGeoserver}/wms?REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&WIDTH=20&HEIGHT=30&legend_options=forceLabels:on;fontStyle:bold;fontSize:12&style=`;

	public searchSite = '';
	public searchResults = signal<any>([]);
	public onSearch(event: AutoCompleteCompleteEvent) {
		const res: any[] = [];

		this._geovisorState.provinces.forEach((prov: string) => {
			if (prov.toLowerCase().includes(event.query.toLowerCase())) {
				res.push({
					name: prov,
					type: 'prov',
				});
			}
		});

		this._geovisorState.municipalities.forEach((mun: string) => {
			if (mun.toLowerCase().includes(event.query.toLowerCase())) {
				res.push({
					name: mun,
					type: 'mun',
				});
			}
		});

		this._geovisorState.apsList.forEach((aps: string) => {
			if (aps.toLowerCase().includes(event.query.toLowerCase())) {
				res.push({
					name: aps,
					type: 'aps',
				});
			}
		});

		this._geovisorState.tcosList.forEach((tcos: string) => {
			if (tcos.toLowerCase().includes(event.query.toLowerCase())) {
				res.push({
					name: tcos,
					type: 'tcos',
				});
			}
		});

		this._geovisorState.ramsarList.forEach((ramsar: string) => {
			if (ramsar.toLowerCase().includes(event.query.toLowerCase())) {
				res.push({
					name: ramsar,
					type: 'ramsar',
				});
			}
		});
		this.searchResults.set(res);
	}

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

	public searchValue(value: string, type: 'mun' | 'prov' | 'tcos' | 'ramsar' | 'aps') {
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
			},
			error: (err: any) => {
				console.error(err);
				this._ts.error('Error al cargar el poligono');
			},
		});
	}

	public onSelect(event: AutoCompleteSelectEvent) {
		this.searchValue(event.value.name, event.value.type);
	}

	public _toggleTermsControl: ToggleItemControl = new ToggleItemControl((value) => this.isTermsVisible.set(value), {
		isVisible: true,
		position: 'topright',
		title: 'Mostrar/Ocultar Terminos de uso',
		iconOn: 'pi pi-info-circle',
		iconOff: 'pi pi-info-circle',
	});
	public isTermsVisible = model(this._toggleLegendControl.getVisibility());

	public showInitData = computed(() => {
		return this._geovisorState.isShowingLeftSidebar();
	});

	public closeInitialData() {
		this._geovisorState.isShowingLeftSidebar.set(false);
	}
	public openInitialData() {
		this._geovisorState.isShowingLeftSidebar.set(true);
	}

	public carouselImages = ['/img/geovisor/1.jpg', '/img/geovisor/2.jpg', '/img/geovisor/3.jpg'];

	private _toggleArcheologicalSitesControl: ToggleItemControl = new ToggleItemControl(
		(value) => {
			this.isArcheologicalSitesVisible.set(value);
			if (value && this.showInitData()) this.closeInitialData();
		},
		{
			position: 'topright',
			title: 'Mostrar/Ocultar Sitios Arqueológicos',
			iconOnHtml: '<img src="img/icons/icon_archeology.png" alt="Icono sitios arqueológicos" />',
			iconOffHtml: '<img src="img/icons/icon_archeology.png" alt="Icono sitios arqueológicos" />',
		},
	);
	public isArcheologicalSitesVisible = model(this._toggleLegendControl.getVisibility());

	public archeologicalSites = rxResource({
		loader: () => this._geovisorService.getArcheologicalSites(),
		defaultValue: [],
	});

	public getImageArcheologicalSite(item: ArcheologicalSite) {
		const wmsUrl = this._geovisorState.wmsUrl;
		const { layer, styleName, bbox } = item;

		return `${wmsUrl}?service=WMS&version=1.1.1&request=GetMap&layers=${layer}&bbox=${bbox.minx},${bbox.miny},${bbox.maxx},${bbox.maxy}&width=246&height=246&srs=${bbox.crs}&styles=${styleName}&format=image%2Fpng&transparent=true`;
	}

	public onArcheologicalSiteClick(item: ArcheologicalSite) {
		if (item.isAdded) {
			this._geovisorState.removeLayer(item);
		} else {
			this._geovisorState.addLayer(item, { mapType: 'archeologicalSite' });
		}
	}

	private _swipeToggleControl: ToggleItemControl = new ToggleItemControl(
		(value) => {
			this._geovisorState.isSideVisible.set(value);
			if (value) {
				this._geovisorState.side?.addTo(this._geovisorState.map);
			} else {
				this._geovisorState.side?.remove(this._geovisorState.map);
			}
		},
		{
			title: 'Mostrar/Ocultar Windy',
			iconOn: 'pi pi-arrows-h',
			iconOff: 'pi pi-arrows-h',
			position: 'topright',
		},
	);

	_sortDialog? = viewChild('sortDialog', { read: Popover });
	private _toggleSortControl: ToggleItemControl = new ToggleItemControl(
		(_, event?: Event) => {
			this._sortDialog?.()?.toggle(event);
		},
		{
			position: 'topright',
			title: 'Ordenar Capas',
			iconOn: 'pi pi-sort-alt',
			iconOff: 'pi pi-sort-alt',
		},
	);

	set sortLayersVisible(value: boolean) {
		this._toggleSortControl.setVisibility(value);
	}
}
