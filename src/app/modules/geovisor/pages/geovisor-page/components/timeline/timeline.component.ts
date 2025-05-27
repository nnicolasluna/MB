import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from '@modules/geovisor/services/state.service';
import { TimelineService } from '@modules/geovisor/services/timeline.service';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
	selector: 'app-timeline',
	imports: [DatePipe, ButtonModule, SelectModule, FormsModule],
	templateUrl: './timeline.component.html',
	styleUrl: './timeline.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
	private geovisorState = inject(StateService);
	private timelineService = inject(TimelineService);

	constructor() {
		effect(() => {
			if (!this.geovisorState.isSideVisible()) {
				setTimeout(() => {
					this.onClear('left');
					this.onClear('right');
				}, 200);
			} else {
				setTimeout(() => {
					this.timelineService.layers.forEach((layer) => {
						this.geovisorState.removeLayer(layer);
					});
				}, 200);
			}
		});
	}

	public timeLineData = computed(() => {
		return this.timelineService.timelineData();
	});

	public isCompareVisible = computed(() => {
		return this.geovisorState.isSideVisible();
	});

	public getIcon() {
		if (this.timelineTimer) {
			return 'pi pi-pause';
		} else {
			return 'pi pi-play';
		}
	}

	public get timelineTimer() {
		return this.timelineService.timelineTimer;
	}

	public set timelineTimer(value: any) {
		this.timelineService.timelineTimer = value;
	}

	public currentIndex = this.timelineService.currentIndex;

	public dataLength = computed(() => {
		return this.timelineService.timelineData().length;
	});

	public playTimeline() {
		if (this.timelineTimer != null) {
			clearInterval(this.timelineTimer);
			this.timelineTimer = null;
			this.timelineService.layers.forEach((layer) => {
				this.geovisorState.removeLayer(layer);
			});

			const idx = this.currentIndex();
			this.geovisorState.addLayer(this.timelineService.layers[idx], {
				mapType: this.timelineService.layers[idx].mapType,
			});
		} else {
			this.timelineService.layers.forEach((layer) => {
				this.geovisorState.removeLayer(layer);
			});

			const map = this.timelineService.layers[this.currentIndex()];
			this.geovisorState.addLayer(map, { mapType: map.mapType });

			this.timelineTimer = setInterval(() => {
				let nextIndex = this.currentIndex() + 1;
				if (nextIndex == this.timeLineData().length) nextIndex = 0;

				let prevLayer =
					nextIndex === 0
						? this.timelineService.layers[this.timelineService.layers.length - 1]
						: this.timelineService.layers[nextIndex - 1];

				this.geovisorState.removeLayer(prevLayer);

				const map = this.timelineService.layers[nextIndex];
				this.geovisorState.addLayer(map, { mapType: map.mapType });

				this.currentIndex.set(nextIndex);
			}, 2000);
		}
	}

	public onTimelineClick(idx: number) {
		this.currentIndex.set(idx);
		this.timelineService.layers.forEach((layer) => {
			this.geovisorState.removeLayer(layer);
		});

		const layer = this.timelineService.layers[idx];
		this.geovisorState.addLayer(layer, { mapType: layer.mapType });
	}

	public onLeftChange(date: string) {
		const item = this.timelineService.layers.find((x) => x.coverageDate === date);

		if (!item) return;

		if (this.timelineService.leftLayer) this.geovisorState.removeLayer(this.timelineService.leftLayer);

		this.timelineService.leftLayer = item;

		this.geovisorState.addLayer(item, {
			mapType: item.mapType,
			pane: 'left',
		});
	}

	public onRightChange(date: string) {
		const item = this.timelineService.layers.find((x) => x.coverageDate === date);

		if (!item) return;

		if (this.timelineService.rightLayer) this.geovisorState.removeLayer(this.timelineService.rightLayer);

		this.timelineService.rightLayer = item;

		this.geovisorState.addLayer(item, {
			mapType: item.mapType,
			pane: 'right',
		});
	}

	public onClear(side: 'left' | 'right') {
		if (side === 'left') {
			if (this.timelineService.leftLayer) {
				this.geovisorState.removeLayer(this.timelineService.leftLayer);
				this.timelineService.leftLayer = null;
			}
		} else if (side === 'right') {
			if (this.timelineService.rightLayer) {
				this.geovisorState.removeLayer(this.timelineService.rightLayer);
				this.timelineService.rightLayer = null;
			}
		}
	}
}
