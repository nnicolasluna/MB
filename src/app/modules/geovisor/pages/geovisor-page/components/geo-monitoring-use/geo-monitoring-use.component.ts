import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { MonitoringUse } from '@modules/monitoring/interfaces/monitoring-use/monitoring-use.interface';
import {
	BaseMonitoringStadisticsComponent,
	SettableStateField,
} from '../base-monitoring/base-monitoring-stadistics.component';
import { MonitoringUseService } from '@modules/monitoring/services/monitoring-use.service';
import { SliderModule } from 'primeng/slider';

@Component({
	selector: 'app-geo-monitoring-use',
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
	providers: [DecimalPipe],
	templateUrl: './geo-monitoring-use.component.html',
	styleUrl: './geo-monitoring-use.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoMonitoringUseComponent extends BaseMonitoringStadisticsComponent<MonitoringUse> {
	override baseData: any;

	public override service: any = inject(MonitoringUseService);

	public monitorinOptionsRs = rxResource({
		loader: () => this._geovisorService.getMonitoringUse(),
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

	protected override currentLayerField: SettableStateField = 'useLayer';
	protected override monitoringType: string = 'use';

	ngOnDestroy(): void {
		this.timelineService.setTimelineData([], '');
		this._geovisorState.area.set(null);
	}

	public showTimeline() {
		this._geovisorState.area.set(this.munTotalArea);

		this.timelineService.setTimelineData(
			this.monitorinOptionsRs.value().items.map((x: MonitoringUse) => {
				return {
					bbox: JSON.parse(x.bbox),
					name: x.name,
					coverageDate: x.coverageDate,
					layer: x.layer,
					styleName: x.styleName,
					id: x.id,
				};
			}),
			'use',
		);
	}

	public ngOnInit(): void {}

	public override loadData() {
		this.service.getStadistics(this.selectedValue!.uuid).subscribe({
			next: (res: any) => {
				this.baseData = res.data;
				this.calculateAreas();
				this._geovisorState.area.set(this.munTotalArea);
				this.calculatePercentageData();
				this.calculateData();
			},
			error: (err: any) => {
				console.error(err);
			},
		});
	}

	private decimalPipe = inject(DecimalPipe);

	public percentageData = signal({});
	public percentageOptions = {
		cutout: '60%',
		plugins: {
			legend: {
				position: 'right',
				labels: {
					color: '#000000',
				},
			},
		},
	};

	public legendColors: any = {
		0: { color: '#419bdf', name: 'Agua' },
		1: { color: '#397d49', name: 'Árboles' },
		2: { color: '#88b053', name: 'Pastura' },
		3: { color: '#7a87c6', name: 'Vegetación inundable' },
		4: { color: '#e49635', name: 'Cultivo 1' },
		5: { color: '#dfc35a', name: 'Arbusto y matorral' },
		6: { color: '#c4281b', name: 'Cultivo 2' },
		7: { color: '#a59b8f', name: 'Desnudo' },
		8: { color: '#b39fe1', name: 'N/C' },
	};

	public calculatePercentageData() {
		let totals = this.baseData.reduce((acc: any, x: any) => {
			if (!x.mun) return acc;
			if (this.legendColors[x.leyenda]) acc[x.leyenda] = (acc[x.leyenda] || 0) + x.sup;
			return acc;
		}, {});

		totals = Object.entries(totals).reduce((acc: any, [key, value]: any[]) => {
			if (this.legendColors[key]) {
				acc[key] = value;
			}
			return acc;
		}, {});

		let data: any = {};

		data.labels = Object.keys(totals).map((x) => {
			return `${this.legendColors[x].name} ${this.decimalPipe.transform(totals[x], '', 'es-ES')} (ha)`;
		});

		data.datasets = [];

		data.datasets.push({
			backgroundColor: Object.keys(totals).map((x) => this.legendColors[x].color),
			data: Object.values(totals),
		});

		this.percentageData.set(data);
	}

	public override calculateProvData(provinces: string[]) {
		const provData = provinces.slice(0, 4).map((prov) => {
			let values: any = {};
			this.baseData.forEach((x: any) => {
				if (x.prov === prov) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
			});

			return {
				name: prov,
				values,
			};
		});

		let data: any = {};

		data.labels = provData.map((prov) => prov.name);
		data.datasets = [];

		provData.forEach((prov) => {
			const legends = Object.keys(prov.values);

			legends.forEach((x, i) => {
				if (!data.datasets[i]) {
					data.datasets[i] = {
						label: this.legendColors[x]?.name,
						backgroundColor: this.legendColors[x]?.color,
						data: [],
					};
				}
				data.datasets[i].data.push(prov.values[x]);
			});
		});

		this.provData.set(data);
	}

	public override calculateMunData(municipalities: string[]) {
		const munData = municipalities.slice(0, 4).map((name) => {
			let values: any = {};
			this.baseData.forEach((x: any) => {
				if (x.mun === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
			});

			return {
				name,
				values,
			};
		});

		let data: any = {};

		data.labels = munData.map((prov) => prov.name);
		data.datasets = [];

		munData.forEach((mun) => {
			const legends = Object.keys(mun.values);

			legends.forEach((x, i) => {
				if (!data.datasets[i]) {
					data.datasets[i] = {
						label: this.legendColors[x]?.name,
						backgroundColor: this.legendColors[x]?.color,
						data: [],
					};
				}
				data.datasets[i].data.push(mun.values[x]);
			});
		});

		this.munData.set(data);
	}

	public override calculateApsData(aps: string[]) {
		const apsData = aps.slice(0, 4).map((name) => {
			let values: any = {};
			this.baseData.forEach((x: any) => {
				if (x.aps === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
			});

			return { name, values };
		});

		let data: any = {};

		data.labels = apsData.map((prov) => prov.name);
		data.datasets = [];

		apsData.forEach((registry) => {
			const legends = Object.keys(registry.values);

			legends.forEach((x, i) => {
				if (!data.datasets[i]) {
					data.datasets[i] = {
						label: this.legendColors[x]?.name,
						backgroundColor: this.legendColors[x]?.color,
						data: [],
					};
				}
				data.datasets[i].data.push(registry.values[x]);
			});
		});

		this.apsData.set(data);
	}

	public override calculateTcosData(tcos: string[]) {
		const tcosData = tcos.slice(0, 4).map((name) => {
			let values: any = {};
			this.baseData.forEach((x: any) => {
				if (x.tcos === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
			});

			return { name, values };
		});

		let data: any = {};

		data.labels = tcosData.map((prov) => prov.name);
		data.datasets = [];

		tcosData.forEach((registry) => {
			const legends = Object.keys(registry.values);

			legends.forEach((x, i) => {
				if (!data.datasets[i]) {
					data.datasets[i] = {
						label: this.legendColors[x]?.name,
						backgroundColor: this.legendColors[x]?.color,
						data: [],
					};
				}
				data.datasets[i].data.push(registry.values[x]);
			});
		});

		this.tcosData.set(data);
	}

	public override calculateRamsarData(ramsars: string[]) {
		const ramsarData = ramsars.slice(0, 4).map((name) => {
			let values: any = {};
			this.baseData.forEach((x: any) => {
				if (x.ramsar === name) values[x.leyenda] = (values[x.leyenda] || 0) + x.sup;
			});

			return { name, values };
		});

		let data: any = {};

		data.labels = ramsarData.map((x) => x.name);
		data.datasets = [];

		ramsarData.forEach((registry) => {
			const legends = Object.keys(registry.values);

			legends.forEach((x, i) => {
				if (!data.datasets[i]) {
					data.datasets[i] = {
						label: this.legendColors[x]?.name,
						backgroundColor: this.legendColors[x]?.color,
						data: [],
					};
				}
				data.datasets[i].data.push(registry.values[x]);
			});
		});

		this.ramsarData.set(data);
	}
}
