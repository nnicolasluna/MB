import 'leaflet.markercluster';

import { Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { MapData } from '@modules/map-data/interfaces';
import {
	Control,
	Layer,
	LayerGroup,
	Map,
	MarkerClusterGroup,
	markerClusterGroup,
	tileLayer,
	WMSOptions,
} from 'leaflet';
import { ToggleItemControl } from '../controls/toggle-item.control';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export enum GeovisorMenuEntries {
	NONE = 'none',
	HOME = 'home',
	MAPS = 'maps',
	MONITORING_WATER = 'monitoring-water',
	MONITORING_FIRE = 'monitoring-fire',
	MONITORING_SOIL_DEGRADATION = 'monitoring-soil-degratation',
	MONITORING_LAND_USE = 'monitoring-land-use',
}

export interface ActiveMap extends Layer {
	mapType?: string;
	mapName: string;
	mapDataId: number | string;
	description?: string;
	sup_ha?: number | string;
	style?: string;
	layer?: string;
	order?: number;
}

@Injectable({
	providedIn: 'root',
})
export class StateService {
	public map?: Map;

	//INFO: Region Limits
	public regionLimitsRaw: any = null;
	public regionLimits: any = null;

	public provinces: string[] = [];
	public municipalities: string[] = [];

	//INFO: APS
	public apsRaw: any = null;
	public aps: any = null;

	public apsList: string[] = [];

	//INFO: TCOS
	public tcosRaw: any = null;
	public tcos: any = null;

	public tcosList: string[] = [];

	//INFO: Ramsar
	public ramsarRaw: any = null;
	public ramsar: any = null;

	public ramsarList: string[] = [];

	// INFO: Hot Spots
	public hotSpotsRaw: any = null;
	public hotSpots: MarkerClusterGroup = markerClusterGroup();
	public isHotSpotActive = signal(false);
	public isHotSpotTab = signal(false);

	// INFO: MonitoringWater
	public monitoringWaterRaw: any = null;
	public monitoringWaterYearsRaw: any = null;
	public waterDifferencesRaw: any = null;
	public waterLayer: any = null;

	// INFO: MonitoringFireRisk
	public monitoringFireRiskRaw: any = null;
	public fireRiskLayer: any = null;

	// INFO: MonitoringBurn
	public monitoringBurnRaw: any = null;
	public fireBurnLayer: any = null;
	public opacityBurnLayer = 1;

	// INFO: SoilAlerts
	public soilAlertsRaw: any = null;
	public soilAlertsLayer: any = null;

	// INFO: Soil
	public MonitoringSoilRaw: any = null;
	public soilLayer: any = null;

	// INFO: Use
	public MonitoringUseRaw: any = null;
	public useLayer: any = null;

	public area = signal<number | null>(null);

	public _layerControl?: Control.Layers;
	public addLayerControl(layerControl: Control.Layers) {
		this._layerControl = layerControl;
	}

	public _legendControl?: ToggleItemControl;
	public addLegendControl(legendControl: ToggleItemControl) {
		this._legendControl = legendControl;
	}

	public currentMenu = signal(GeovisorMenuEntries.NONE);
	public sidebarTitle = signal('');
	public isShowingSidebar = signal(false);
	public isShowingLeftSidebar = signal(true);

	public activeMaps = signal<ActiveMap[]>([]);
	public leftMapsLayers = new LayerGroup([], { pane: 'left' });
	public rightMapsLayers = new LayerGroup([], { pane: 'right' });
	public activeIdMaps: { id: number; opacity: number; tileMap: Layer }[] = [];

	constructor() {}

	private getLayerName(map: MapData) {
		return map.typeGeom === 'Raster' ? `a_${map.nameImage?.replace(/-/g, '_')}` : map.layer;
	}

	public leftLayers: any[] = [];
	public rightLayers: any[] = [];

	public addMapData(map: MapData, side?: 'left' | 'right') {
		const opts: WMSOptions = {
			layers: `${this.getLayerName(map)}`,
			format: 'image/png',
			opacity: map.opacity,
			transparent: true,
			version: '1.3.0',
		};

		if (map.style?.name) opts['styles'] = map.style.name;
		if (side) opts['pane'] = side;

		const tileMap = tileLayer.wms(this.wmsUrl, opts) as unknown as ActiveMap;

		tileMap.mapType = map.typeGeom === 'Raster' ? 'raster' : 'mapData';
		tileMap.mapName = map.name;
		tileMap.mapDataId = map.id;
		tileMap.style = map.style?.name;
		tileMap.layer = map.typeGeom === 'Raster' ? `a_${map.nameImage}` : map.layer;

		map.isAdded = true;
		map.tileMap = tileMap as any;

		this._layerControl?.addOverlay(tileMap, map.name);

		if (this.isSideVisible()) {
			if (side == 'left') {
				this.leftLayers.push(tileMap);
				this.map?.addLayer(tileMap);
				this.side?.setLeftLayers([...this.leftLayers]);
			} else {
				this.rightLayers.push(tileMap);
				this.map?.addLayer(tileMap);
				this.side?.setRightLayers([...this.rightLayers]);
			}
			this.activeMaps.set([...this.activeMaps(), tileMap]);
		} else {
			this.map?.addLayer(tileMap);
			this.activeMaps.set([...this.activeMaps(), tileMap]);
			this.activeIdMaps.push({ id: map.id, opacity: map.opacity!, tileMap: map.tileMap! });
		}

		if (!this._legendControl?.getVisibility()) this._legendControl?.setVisibility(true);
	}

	public removeMapData(map: MapData) {
		map.isAdded = false;
		if (!map.tileMap) return;
		map.tileMap.remove();
		this._layerControl?.removeLayer(map.tileMap);
		this.activeMaps.set(this.activeMaps().filter((m: any) => m !== map.tileMap));
		if ((map.tileMap as any).mapType === 'mapData')
			this.activeIdMaps = this.activeIdMaps.filter(({ id }) => id !== map.id);

		if (this.activeMaps().length === 0) this._legendControl?.setVisibility(false);
	}

	get wmsUrl() {
		const geoserverUrl = environment.urlGeoserver.endsWith('/')
			? environment.urlGeoserver.slice(0, -1)
			: environment.urlGeoserver;
		return `${geoserverUrl}/${environment.workspaceGeoserver}/wms`;
	}

	get geoserverUrl() {
		return environment.urlGeoserver.endsWith('/') ? environment.urlGeoserver.slice(0, -1) : environment.urlGeoserver;
	}

	public addLayer(obj: any, opts: any) {
		if (!this.map) throw new Error('Map is not initialized');

		const wmsOpts: WMSOptions = {
			layers: `${obj.layer}`,
			format: 'image/png',
			opacity: obj.opacity,
			transparent: true,
			version: '1.3.0',
		};

		if (obj.style?.name) wmsOpts['styles'] = obj.style.name;
		if (obj.styleName) wmsOpts['styles'] = obj.styleName;
		if (opts.pane) wmsOpts['pane'] = opts.pane;

		const tileMap = tileLayer.wms(this.wmsUrl, wmsOpts) as unknown as ActiveMap;

		tileMap.mapType = opts.mapType;
		tileMap.mapName = obj.name;
		tileMap.mapDataId = obj.id;
		tileMap.style = wmsOpts['styles'];
		tileMap.layer = obj.layer;

		obj.isAdded = true;
		obj.tileMap = tileMap as any;

		this._layerControl?.addOverlay(tileMap, obj.name);

		if (this.isSideVisible()) {
			if (opts.pane === 'left') {
				this.leftLayers.push(tileMap);
				this.map.addLayer(tileMap);
				this.side?.setLeftLayers([...this.leftLayers]);
			} else {
				this.rightLayers.push(tileMap);
				this.map.addLayer(tileMap);
				this.side?.setRightLayers([...this.rightLayers]);
			}
			this.activeMaps.set([...this.activeMaps(), tileMap]);
		} else {
			this.map.addLayer(tileMap);
			this.activeMaps.set([...this.activeMaps(), tileMap]);
		}

		if (!this._legendControl?.getVisibility()) this._legendControl?.setVisibility(true);
	}

	public removeLayer(obj: any) {
		obj.isAdded = false;
		if (!obj.tileMap) return;
		obj.tileMap.remove();
		this._layerControl?.removeLayer(obj.tileMap);
		this.activeMaps.set(this.activeMaps().filter((m: any) => m !== obj.tileMap));

		if (this.activeMaps().length === 0) this._legendControl?.setVisibility(false);
	}

	isSideVisible = signal(false);
	side: any = null;
}
