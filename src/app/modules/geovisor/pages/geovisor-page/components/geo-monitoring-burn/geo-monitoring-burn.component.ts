import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { MonitoringBurnService } from '@modules/monitoring/services/monitoring-burn.service';
import { MonitoringBurn } from '@modules/monitoring/interfaces/monitoring-burn/monitoring-burn.interface';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import {
	BaseMonitoringStadisticsComponent,
	SettableStateField,
} from '../base-monitoring/base-monitoring-stadistics.component';
import { SliderModule } from 'primeng/slider';

@Component({
	selector: 'app-geo-monitoring-burn',
	imports: [
		SliderModule,
		ButtonModule,
		DatePipe,
		ReactiveFormsModule,
		FormsModule,
		MultiSelectModule,
		AccordionModule,
		SelectModule,
		TabsModule,
		ChartModule,
		BarChartComponent,
		LoaderComponent,
	],
	templateUrl: './geo-monitoring-burn.component.html',
	styleUrl: './geo-monitoring-burn.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoMonitoringBurnComponent extends BaseMonitoringStadisticsComponent<MonitoringBurn> {
	override baseData: any;

	override ngOnDestroy(): void {
		this.timelineService.setTimelineData([], '');
		this._geovisorState.area.set(null);
	}

	protected override legendColor: string = '#e98419';
	protected override currentLayerField: SettableStateField = 'fireBurnLayer';
	protected override monitoringType: string = 'burn';

	public service = inject(MonitoringBurnService);

	public monitorinOptionsRs = rxResource({
		loader: () => this._geovisorService.getMonitoringBurn(),
		defaultValue: { items: [], total: 0 },
	});

	public showTimeline() {
		this._geovisorState.area.set(this.munTotalArea);

		this.timelineService.setTimelineData(
			this.monitorinOptionsRs.value().items.map((x: MonitoringBurn) => {
				return {
					bbox: JSON.parse(x.bbox),
					name: x.name,
					coverageDate: x.coverageDate,
					layer: x.layer,
					styleName: x.styleName,
					id: x.id,
				};
			}),
			this.monitoringType,
		);
	}

	constructor() {
		super();
		effect(() => {
			if (!this.monitorinOptionsRs.isLoading()) {
				this.selectedValue = this.monitorinOptionsRs.value().items[0];
				this.showTimeline();
				this.loadData();
			}
		});
	}

	public ngOnInit(): void {}
}
