import { UserModel } from '@modules/users/interfaces';
import { TileLayer } from 'leaflet';

export interface SoilAlert {
	id: number;
	uuid: string;
	createdDate: string;
	name: string;
	description: string;
	coverageDate: string;
	coverageState: string;
	createdBy: UserModel;

	layer: string;
	bbox: string;

	styleName: string;

	// Custom properties for frontend
	isAdded?: boolean;
	opacity?: number;
	tileMap?: TileLayer.WMS;
}
