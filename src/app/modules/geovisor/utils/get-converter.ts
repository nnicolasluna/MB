import { UTMToLatLng } from './utm-latlng';

export interface DMS {
	d: number;
	m: number;
	s: number;
	dir?: 'N' | 'S' | 'E' | 'W';
}

export class LatLngConverter {
	constructor(
		public lat: number,
		public lng: number,
	) {}

	private toDMS(deg: number): DMS {
		const d = Math.floor(deg);
		const m = Math.floor((deg - d) * 60);
		const s = ((deg - d) * 60 - m) * 60;
		return { d, m, s };
	}

	public getDMS(): { x: DMS; y: DMS } {
		const latDMS = this.toDMS(this.lat);
		const lngDMS = this.toDMS(this.lng);
		return {
			x: { ...latDMS, dir: this.lat >= 0 ? 'N' : 'S' },
			y: { ...lngDMS, dir: this.lng >= 0 ? 'E' : 'W' },
		};
	}

	public getUTM() {
		const utmConverter = new UTMToLatLng();
		return utmConverter.convertLatLngToUtm(this.lat, this.lng, 6);
	}
}

export class UTMConverter {
	constructor(
		public x: number,
		public y: number,
		public zone: number,
		public zoneLetter: string,
	) {}

	public getLatLng() {
		const utmConverter = new UTMToLatLng();
		return utmConverter.convertUtmToLatLng(this.x, this.y, this.zone, this.zoneLetter) as { lat: number; lng: number };
	}

	public getDMS() {
		const { lat, lng } = this.getLatLng();
		const latConverter = new LatLngConverter(lat, lng);
		return latConverter.getDMS();
	}
}

export class DMSConverter {
	constructor(
		public x: DMS,
		public y: DMS,
	) {}

	public getLatLng() {
		const lat = (this.x.d + this.x.m / 60 + this.x.s / 3600) * (this.x.dir === 'N' ? 1 : -1);
		const lng = (this.y.d + this.y.m / 60 + this.y.s / 3600) * (this.y.dir === 'E' ? 1 : -1);
		return { lat, lng };
	}

	public getUTM() {
		const { lat, lng } = this.getLatLng();
		const latLngConverter = new LatLngConverter(lat, lng);
		return latLngConverter.getUTM();
	}
}
