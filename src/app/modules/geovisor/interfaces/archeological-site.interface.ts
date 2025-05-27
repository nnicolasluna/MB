import { TileLayer } from 'leaflet';

export interface ArcheologicalSite {
	id: number;
	name: string;
	layer: string;
	styleName: string;
	bbox: {
		minx: number;
		miny: number;
		maxx: number;
		maxy: number;
		crs: string;
	};

	// Custom properties for frontend
	isAdded?: boolean;
	opacity?: number;
	tileMap?: TileLayer.WMS;
}
