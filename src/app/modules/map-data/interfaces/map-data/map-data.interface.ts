import { TileLayer } from 'leaflet';
import { Style } from '../style/style.interface';

export interface MapData {
	id: number;
	uuid: string;
	name: string;
	typeGeom: string;
	description: string;
	updateFrequency: string;
	contentDate: string;

	layer: string;
	bbox: string;

	isPublic: boolean;
	allowDownload: boolean;

	idStyle: number;
	style?: Style;

	// Custom properties for frontend
	isAdded?: boolean;
	opacity?: number;
	tileMap?: TileLayer.WMS;

	// RASTER
	urlImage?: string;
	srsImage?: string;
	nameImage?: string;
	importId?: number;
	bboxImage?: any;
}
