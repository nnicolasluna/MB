import { Map, Control, DomUtil } from 'leaflet';

export class PositionControl extends Control {
	private latlng: HTMLElement | null;

	constructor(options?: L.ControlOptions) {
		super(options);
		this.options.position = options?.position || 'bottomleft';
		this.latlng = null;
	}

	override onAdd(map: Map): HTMLElement {
		const latlng = DomUtil.create('div', 'position-control');
		this.latlng = latlng;

		map.on('mousemove', (e) => {
			this.update(e.latlng.lat, e.latlng.lng);
		});

		return latlng;
	}

	public update(lat: number, lng: number): void {
		if (this.latlng) {
			this.latlng.innerHTML = 'Lat: ' + lat.toFixed(3) + '<br />Lon: ' + lng.toFixed(3);
		}
	}
}
