import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { MonitoringWaterService } from '@modules/monitoring/services/monitoring-water.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MonitoringWater } from '@modules/monitoring/interfaces/monitoring-water/monitoring-water.interface';
import { ChartOptions } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import {
	BaseMonitoringStadisticsComponent,
	SettableStateField,
} from '../base-monitoring/base-monitoring-stadistics.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { SliderModule } from 'primeng/slider';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-geo-monitoring-water',
	imports: [
		SliderModule,
		ButtonModule,
		DatePipe,
		ReactiveFormsModule,
		FormsModule,
		ChartModule,
		MultiSelectModule,
		AccordionModule,
		SelectModule,
		TabsModule,
		BarChartComponent,
		LoaderComponent,
	],
	templateUrl: './geo-monitoring-water.component.html',
	styleUrl: './geo-monitoring-water.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoMonitoringWaterComponent extends BaseMonitoringStadisticsComponent<MonitoringWater> {
	override baseData: any;

	public override service = inject(MonitoringWaterService);

	public monitorinOptionsRs = rxResource({
		loader: () => this._geovisorService.getMonitoringWater(),
		defaultValue: { items: [], total: 0 },
	});

	constructor() {
		super();
		effect(() => {
			if (!this.monitorinOptionsRs.isLoading()) {
				this.selectedValue = this.monitorinOptionsRs.value().items[0];
				this.timelineService.setTimelineData(
					this.monitorinOptionsRs.value().items.map((x: MonitoringWater) => {
						return {
							bbox: JSON.parse(x.bbox),
							name: x.name,
							coverageDate: x.coverageDate,
							id: x.id,
							layer: x.layer,
							styleName: x.styleName,
						};
					}),
					'water',
				);
				this.loadData();
			}
		});
	}

	public override loadData() {
		this.isLoading.set(true);
		this.service.getStadistics(this.selectedValue!.uuid).subscribe({
			next: (res: any) => {
				this.baseData = res.data;
				this.calculateAreas();
				this._geovisorState.area.set(this.munTotalArea);
				this.calculateData();
				this.isLoading.set(false);
			},
			error: (err: any) => {
				console.error(err);
				this._ts.error('Error al cargar los datos');
				this.isLoading.set(false);
			},
		});
	}

	ngOnDestroy(): void {
		this.timelineService.setTimelineData([], '');
		this._geovisorState.area.set(null);
	}

	protected override currentLayerField: SettableStateField = 'waterLayer';
	protected override monitoringType: string = 'water';

	public yearsData: any = signal({});
	public yearOptions: ChartOptions = {
		plugins: {
			title: {
				display: true,
				text: 'Resumen Estadístico de Cuerpos de Agua',
				font: {
					size: 14,
				},
			},
			legend: {
				labels: {
					color: '#495057',
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: '#495057',
				},
				grid: {
					color: '#ebedef',
				},
			},
			y: {
				ticks: {
					color: '#495057',
				},
				grid: {
					color: '#ebedef',
				},
			},
		},
	};

	public ngOnInit(): void {
		this.service.getYearResume().subscribe({
			next: (res: any) => {
				const labels = Object.keys(res);
				const values = Object.values(res);

				this.yearsData.set({
					labels,
					datasets: [
						{
							type: 'line',
							label: 'Superficie (ha)',
							borderColor: '#23b7d1',
							borderWidth: 2,
							fill: false,
							tension: 0.4,
							data: values,
						},
						{
							type: 'bar',
							label: 'Superficie (ha)',
							backgroundColor: '#1240af',
							data: values,
						},
					],
				});
			},
			error: (_: any) => {
				this._ts.error('Error al cargar los datos');
			},
		});
	}

	public legendColors: any = {
		laguna: { color: '#009fff', name: 'Laguna' },
		rio: { color: '#024bfa', name: 'Rio' },
	};

	public override calculateProvData(provinces: string[]) {
		const provData = provinces
			.map((prov) => {
				const values: any = {};
				this.baseData.forEach((x: any) => {
					if (x.prov === prov) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
				});

				return {
					name: prov,
					values,
				};
			})
			.sort((a: any, b: any) => {
				return b.values.laguna - a.values.laguna;
			});

		let data: any = {};

		data.labels = provData.map((prov) => prov.name);

		data.datasets = [];

		data.datasets.push({
			label: `Superficie ${this.legendColors['laguna'].name} (ha)`,
			backgroundColor: this.legendColors['laguna'].color,
			data: provData.map((prov) => prov.values.laguna),
		});

		data.datasets.push({
			label: `Superficie ${this.legendColors['rio'].name} (ha)`,
			backgroundColor: this.legendColors['rio'].color,
			data: provData.map((prov) => prov.values.rio),
		});

		this.provData.set(data);
	}

	public override calculateMunData(municipalities: string[]) {
		const munData = municipalities
			.map((name) => {
				const values: any = {};
				this.baseData.forEach((x: any) => {
					if (x.mun === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
				});

				return {
					name,
					values,
				};
			})
			.sort((a: any, b: any) => b.values.laguna - a.values.laguna);

		let data: any = {};

		data.labels = munData.map((prov) => prov.name);
		data.datasets = [];

		data.datasets.push({
			label: `Superficie ${this.legendColors['laguna'].name} (ha)`,
			backgroundColor: this.legendColors['laguna'].color,
			data: munData.map((prov) => prov.values.laguna),
		});

		data.datasets.push({
			label: `Superficie ${this.legendColors['rio'].name} (ha)`,
			backgroundColor: this.legendColors['rio'].color,
			data: munData.map((prov) => prov.values.rio),
		});

		this.munData.set(data);
	}

	public override calculateApsData(aps: string[]) {
		const apsData = aps
			.map((name) => {
				const values: any = {};
				this.baseData.forEach((x: any) => {
					if (x.aps === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
				});

				return {
					name,
					values,
				};
			})
			.sort((a: any, b: any) => b.values.laguna - a.values.laguna);

		let data: any = {};

		data.labels = apsData.map((prov) => prov.name);
		data.datasets = [];

		data.datasets.push({
			label: `Superficie ${this.legendColors['laguna'].name} (ha)`,
			backgroundColor: this.legendColors['laguna'].color,
			data: apsData.map((prov) => prov.values.laguna),
		});

		data.datasets.push({
			label: `Superficie ${this.legendColors['rio'].name} (ha)`,
			backgroundColor: this.legendColors['rio'].color,
			data: apsData.map((prov) => prov.values.rio),
		});

		this.apsData.set(data);
	}

	public override calculateTcosData(tcos: string[]) {
		const tcosData = tcos
			.map((name) => {
				const values: any = {};
				this.baseData.forEach((x: any) => {
					if (x.tcos === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
				});

				return {
					name,
					values,
				};
			})
			.sort((a: any, b: any) => b.values.laguna - a.values.laguna);

		let data: any = {};

		data.labels = tcosData.map((prov) => prov.name);
		data.datasets = [];

		data.datasets.push({
			label: `Superficie ${this.legendColors['laguna'].name} (ha)`,
			backgroundColor: this.legendColors['laguna'].color,
			data: tcosData.map((prov) => prov.values.laguna),
		});

		data.datasets.push({
			label: `Superficie ${this.legendColors['rio'].name} (ha)`,
			backgroundColor: this.legendColors['rio'].color,
			data: tcosData.map((prov) => prov.values.rio),
		});

		this.tcosData.set(data);
	}

	public override calculateRamsarData(ramsars: string[]) {
		const ramsarData = ramsars
			.map((name) => {
				const values: any = {};
				this.baseData.forEach((x: any) => {
					if (x.ramsar === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
				});

				return {
					name,
					values,
				};
			})
			.sort((a: any, b: any) => b.values.laguna - a.values.laguna);

		let data: any = {};

		data.labels = ramsarData.map((x) => x.name);
		data.datasets = [];

		data.datasets.push({
			label: `Superficie ${this.legendColors['laguna'].name} (ha)`,
			backgroundColor: this.legendColors['laguna'].color,
			data: ramsarData.map((prov) => prov.values.laguna),
		});

		data.datasets.push({
			label: `Superficie ${this.legendColors['rio'].name} (ha)`,
			backgroundColor: this.legendColors['rio'].color,
			data: ramsarData.map((prov) => prov.values.rio),
		});

		this.ramsarData.set(data);
	}
}
