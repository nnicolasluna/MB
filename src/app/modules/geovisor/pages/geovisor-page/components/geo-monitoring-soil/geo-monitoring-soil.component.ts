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
import { MonitoringSoilService } from '@modules/monitoring/services/monitoring-soil.service';
import { MonitoringSoil } from '@modules/monitoring/interfaces/monitoring-soil/monitoring-soil.interface';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import {
	BaseMonitoringStadisticsComponent,
	SettableStateField,
} from '../base-monitoring/base-monitoring-stadistics.component';
import { SliderModule } from 'primeng/slider';

@Component({
	selector: 'app-geo-monitoring-soil',
	imports: [
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
		SliderModule,
	],
	templateUrl: './geo-monitoring-soil.component.html',
	styleUrl: './geo-monitoring-soil.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoMonitoringSoilComponent extends BaseMonitoringStadisticsComponent<MonitoringSoil> {
	override baseData: any;

	public service = inject(MonitoringSoilService);

	public monitorinOptionsRs = rxResource({
		loader: () => this._geovisorService.getMonitoringSoil(),
		defaultValue: { items: [], total: 0 },
	});

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

	protected override currentLayerField: SettableStateField = 'soilLayer';
	protected override monitoringType: string = 'soil';
	protected override legendColor = '#cf5757';

	ngOnDestroy(): void {
		this.timelineService.setTimelineData([], '');
		this._geovisorState.area.set(null);
	}

	public showTimeline() {
		this._geovisorState.area.set(this.munTotalArea);

		this.timelineService.setTimelineData(
			this.monitorinOptionsRs.value().items.map((x: MonitoringSoil) => {
				return {
					bbox: JSON.parse(x.bbox),
					name: x.name,
					coverageDate: x.coverageDate,
					layer: x.layer,
					styleName: x.styleName,
					id: x.id,
				};
			}),
			'soil',
		);
	}

	public ngOnInit(): void {
		this.showTimeline();
	}
}
