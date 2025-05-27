import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { SoilAlert } from '@modules/monitoring/interfaces/soil-alert/soil-alert.interface';
import {
	BaseMonitoringStadisticsComponent,
	SettableStateField,
} from '../base-monitoring/base-monitoring-stadistics.component';
import { SoilAlertService } from '@modules/monitoring/services/soil-alert.service';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { SliderModule } from 'primeng/slider';

@Component({
	selector: 'app-geo-soil-alert',
	imports: [
		ButtonModule,
		DatePipe,
		ReactiveFormsModule,
		SliderModule,
		FormsModule,
		MultiSelectModule,
		AccordionModule,
		SelectModule,
		TabsModule,
		ChartModule,
		BarChartComponent,
		LoaderComponent,
	],
	templateUrl: './geo-soil-alert.component.html',
	styleUrl: './geo-soil-alert.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoSoilAlertComponent extends BaseMonitoringStadisticsComponent<SoilAlert> {
	override baseData: any;
	override ngOnDestroy(): void {
		this.timelineService.setTimelineData([], '');
		this._geovisorState.area.set(null);
	}

	public service = inject(SoilAlertService);

	public monitorinOptionsRs = rxResource({
		loader: () => this._geovisorService.getSoilAlerts(),
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

	protected override currentLayerField: SettableStateField = 'soilAlertsLayer';
	protected override monitoringType: string = 'soilAlert';

	public showTimeline() {
		this._geovisorState.area.set(null);

		this.timelineService.setTimelineData(
			this.monitorinOptionsRs.value().items.map((x: SoilAlert) => {
				return {
					bbox: JSON.parse(x.bbox),
					name: x.name,
					coverageDate: x.coverageDate,
					layer: x.layer,
					styleName: x.styleName,
					id: x.id,
				};
			}),
			'soilAlert',
		);
	}

	public ngOnInit(): void {}

	public override loadData() {
		this.isLoading.set(true);
		this.service.getStadistics(this.selectedValue!.uuid).subscribe({
			next: (res: any) => {
				this.baseData = res.data;
				this.calculateAreas();
				this.calculateData();
				this._geovisorState.area.set(this.munTotalArea);
				this.loadLegend();
				this.isLoading.set(false);
			},
			error: (err: any) => {
				console.error(err);
				this._ts.error('Error al cargar los datos');
				this.isLoading.set(false);
			},
		});
	}

	public legend = signal<any>({});

	private loadLegend() {
		const newLegend = {
			critic: {
				area: 0,
				percentage: 0,
			},
			high: {
				area: 0,
				percentage: 0,
			},
			medium: {
				area: 0,
				percentage: 0,
			},
		};

		this.baseData.forEach((x: any) => {
			if (x.mun) {
				if (x.cambio == 'Crítica') newLegend.critic.area += x.sup;
				if (x.cambio == 'Alta') newLegend.high.area += x.sup;
				if (x.cambio == 'Moderada') newLegend.medium.area += x.sup;
			}
		});

		newLegend.critic.area = newLegend.critic.area.toFixed(2) as any;
		newLegend.high.area = newLegend.high.area.toFixed(2) as any;
		newLegend.medium.area = newLegend.medium.area.toFixed(2) as any;

		this.legend.set(newLegend);
	}
}
