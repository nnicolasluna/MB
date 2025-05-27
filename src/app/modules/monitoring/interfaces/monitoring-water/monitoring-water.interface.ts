import { UserModel } from '@modules/users/interfaces';
import { TileLayer } from 'leaflet';
import { BaseMonitoring } from '../base-monitoring.interface';

export interface MonitoringWater extends BaseMonitoring {
	id: number;
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
