import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { TileLayer } from 'leaflet';
import { StateService } from './state.service';

export interface TimelineData {
	id: number;
	coverageDate: string;
	layer: string;
	name: string;
	styleName: string;

	bbox: any;

	mapType?: string;

	isAdded?: boolean;
	opacity?: number;
	tileMap?: TileLayer.WMS;
}

@Injectable({
	providedIn: 'root',
})
export class TimelineService {
	private geovisorState = inject(StateService);

	private queue: { data: TimelineData[]; type: string; opts: any }[] = [];
	private isProcessing = false;

	get wmsUrl() {
		const geoserverUrl = environment.urlGeoserver.endsWith('/')
			? environment.urlGeoserver.slice(0, -1)
			: environment.urlGeoserver;
		return `${geoserverUrl}/${environment.workspaceGeoserver}/wms`;
	}

	public timelineData = signal<string[]>([]);
	public layers: TimelineData[] = [];

	public timelineTimer: any = null;

	public setTimelineData(data: TimelineData[], type: string, opts = { isFirstTime: true }) {
		this.queue.push({ data, type, opts });
		this.processQueue();
	}

	private processQueue() {
		if (this.isProcessing || this.queue.length === 0) {
			return;
		}

		this.isProcessing = true;
		const { data, type, opts } = this.queue.shift()!;

		this.processData(data, type, opts)
			.then(() => {
				this.isProcessing = false;
				this.processQueue();
			})
			.catch((error) => {
				this.isProcessing = false;
				console.error('Error processing timeline data:', error);
			});
	}

	private processData(data: TimelineData[], type: string, opts = { isFirstTime: true }): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				for (let d of this.layers) {
					this.geovisorState.removeLayer(d);
				}
				this.layers = [];

				if (this.timelineTimer) clearInterval(this.timelineTimer);

				const newData = data
					.sort((a, b) => new Date(a.coverageDate).getTime() - new Date(b.coverageDate).getTime())
					.map((x: any) => {
						return x;
					});

				this.layers = newData.map((x) => {
					x.mapType = type;
					return x;
				});

				this.timelineData.set(newData.map((x) => x.coverageDate));
				setTimeout(() => {
					if (opts.isFirstTime) {
						if (this.layers.length > 0 && this.layers[this.layers.length - 1]) {
							this.geovisorState.addLayer(this.layers[this.layers.length - 1], {
								mapType: type,
							});

							this.currentIndex.set(this.layers.length - 1);
						}
					} else {
						this.geovisorState.addLayer(this.layers[this.currentIndex()], {
							mapType: type,
						});
					}
					resolve();
				}, 200);
			} catch (error) {
				reject(error);
			}
		});
	}

	public currentIndex = signal(0);

	public get currentItem() {
		return this.layers[this.currentIndex()];
	}

	public changeItem(item: any) {
		this.currentIndex.set(this.layers.findIndex((x) => x.layer === item.layer));
		this.setTimelineData(this.layers, item.mapType!, { isFirstTime: false });
	}

	public setOpacity(opacity: number) {
		for (let layer of this.layers) {
			if (layer.layer === this.currentItem.layer) {
				layer.opacity = opacity;
				layer.tileMap?.setOpacity(opacity);
			}
		}
	}

	leftLayer: any = null;
	rightLayer: any = null;
}
