import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { MonitoringWaterService } from '@modules/monitoring/services/monitoring-water.service';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MonitoringWater } from '@modules/monitoring/interfaces/monitoring-water/monitoring-water.interface';
import { ChartOptions } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { BaseMonitoringStadisticsComponent } from '../../../base-monitoring/base-monitoring-stadistics.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BarChartComponent } from '../../../bar-chart/bar-chart.component';
import dayjs from 'dayjs';

@Component({
	selector: 'app-geo-dec-inc-water',
	imports: [
		ButtonModule,
		DatePipe,
		ReactiveFormsModule,
		FormsModule,
		ChartModule,
		MultiSelectModule,
		AccordionModule,
		SelectModule,
		TabsModule,
		LoaderComponent,
		BarChartComponent,
	],
	templateUrl: './dec-inc-water.component.html',
	styleUrl: './dec-inc-water.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecIncWaterComponent extends BaseMonitoringStadisticsComponent<MonitoringWater> {
	override baseData: any;
	override ngOnDestroy(): void {}

	public service = inject(MonitoringWaterService);

	public monitorinOptionsRs = rxResource({
		loader: () => this._geovisorService.getMonitoringWater(),
		defaultValue: { items: [], total: 0 },
	});

	public startMonitorings = computed(() => {
		return this.monitorinOptionsRs.value().items.filter((x: any) => x.uuid != this.endMonitoring?.uuid);
	});

	public endMonitorings = computed(() => {
		return this.monitorinOptionsRs.value().items.filter((x: any) => x.uuid != this.startMonitoring?.uuid);
	});

	public startMonitoring?: MonitoringWater;
	public endMonitoring?: MonitoringWater;

	constructor() {
		super();
		effect(() => {
			if (!this.monitorinOptionsRs.isLoading()) {
				if (this.monitorinOptionsRs.value().items.length <= 2) return;

				this.startMonitoring = this.monitorinOptionsRs.value().items[0];
				this.endMonitoring = this.monitorinOptionsRs.value().items[1];
				this.loadData();
			}
		});
	}

	public yearsData: any = signal({});
	public yearOptions: ChartOptions = {
		plugins: {
			title: {
				display: true,
				text: 'Resumen Estadístico de Cuerpos de Agua por Gestión',
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

	public override loadData() {
		this.service.getDifference(this.startMonitoring!.uuid, this.endMonitoring!.uuid).subscribe({
			next: (res: any) => {
				this.baseData = res;
				this.calculateGeneral();
				this.calculateData();
				this.isLoading.set(false);
			},
			error: (err) => {
				console.error(err);
				this._ts.error('Error al cargar los datos');
				this.isLoading.set(false);
			},
		});
	}

	public override calculateProvData(provinces: string[]) {
		const provData = provinces
			.map((prov) => {
				let value1 = 0,
					value2 = 0;
				this.baseData.forEach((x: any) => {
					if (x.prov === prov) {
						if (x.sup_1 > x.sup_2) {
							value1 += x.sup_1;
						} else {
							value2 += x.sup_2;
						}
					}
				});

				return {
					name: prov,
					value1,
					value2,
				};
			})
			.sort((a: any, b: any) => {
				return b.value1 - a.value1;
			});

		let data: any = {};

		data.labels = provData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: `Decremento (ha)`,
			backgroundColor: '#ff3333',
			data: provData.map((prov) => prov.value1),
		});

		data.datasets.push({
			label: `Incremento (ha)`,
			backgroundColor: '#1240af',
			data: provData.map((prov) => prov.value2),
		});

		this.provData.set(data);
	}

	//INFO: Mun Data
	public override calculateMunData(municipalities: string[]) {
		const munData = municipalities
			.map((name) => {
				let value1 = 0,
					value2 = 0;
				this.baseData.forEach((x: any) => {
					if (x.mun === name) {
						if (x.sup_1 > x.sup_2) {
							value1 += x.sup_1;
						} else {
							value2 += x.sup_2;
						}
					}
				});

				return {
					name,
					value1,
					value2,
				};
			})
			.sort((a: any, b: any) => b.value1 - a.value1);

		let data: any = {};

		data.labels = munData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: `Decremento (ha)`,
			backgroundColor: '#ff3333',
			data: munData.map((prov) => prov.value1),
		});

		data.datasets.push({
			label: `Incremento (ha)`,
			backgroundColor: '#1240af',
			data: munData.map((prov) => prov.value2),
		});
		this.munData.set(data);
	}

	// INFO: APS Data
	public override calculateApsData(aps: string[]) {
		const apsData = aps
			.map((name) => {
				let value1 = 0,
					value2 = 0;
				this.baseData.forEach((x: any) => {
					if (x.aps === name) {
						if (x.sup_1 > x.sup_2) {
							value1 += x.sup_1;
						} else {
							value2 += x.sup_2;
						}
					}
				});

				return {
					name,
					value1,
					value2,
				};
			})
			.sort((a: any, b: any) => b.value1 - a.value1);

		let data: any = {};

		data.labels = apsData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: `Decremento (ha)`,
			backgroundColor: '#ff3333',
			data: apsData.map((x) => x.value1),
		});

		data.datasets.push({
			label: `Incremento (ha)`,
			backgroundColor: '#1240af',
			data: apsData.map((x) => x.value2),
		});

		this.apsData.set(data);
	}

	//INFO: TCOS Data
	public override calculateTcosData(tcos: string[]) {
		const tcosData = tcos
			.map((name) => {
				let value1 = 0,
					value2 = 0;
				this.baseData.forEach((x: any) => {
					if (x.tcos === name) {
						if (x.sup_1 > x.sup_2) {
							value1 += x.sup_1;
						} else {
							value2 += x.sup_2;
						}
					}
				});

				return {
					name,
					value1,
					value2,
				};
			})
			.sort((a: any, b: any) => b.value1 - a.value1);

		let data: any = {};

		data.labels = tcosData.map((prov) => prov.name);
		data.datasets = [];

		data.datasets.push({
			label: `Decremento (ha)`,
			backgroundColor: '#ff3333',
			data: tcosData.map((x) => x.value1),
		});

		data.datasets.push({
			label: `Incremento (ha)`,
			backgroundColor: '#1240af',
			data: tcosData.map((x) => x.value2),
		});

		this.tcosData.set(data);
	}

	//INFO: Ramsar Data
	public override calculateRamsarData(ramsars: string[]) {
		const ramsarData = ramsars
			.map((name) => {
				let value1 = 0,
					value2 = 0;
				this.baseData.forEach((x: any) => {
					if (x.ramsar === name) {
						if (x.sup_1 > x.sup_2) {
							value1 += x.sup_1;
						} else {
							value2 += x.sup_2;
						}
					}
				});

				return {
					name,
					value1,
					value2,
				};
			})
			.sort((a: any, b: any) => b.value1 - a.value1);

		let data: any = {};

		data.labels = ramsarData.map((x) => x.name);
		data.datasets = [];

		data.datasets.push({
			label: `Decremento (ha)`,
			backgroundColor: '#ff3333',
			data: ramsarData.map((x) => x.value1),
		});

		data.datasets.push({
			label: `Incremento (ha)`,
			backgroundColor: '#1240af',
			data: ramsarData.map((x) => x.value2),
		});

		this.ramsarData.set(data);
	}

	public processQuery() {
		this.isLoading.set(true);
		this.loadData();
	}

	public difference = signal<{ label: string; dir: string }>({ label: '', dir: '' });
	public generalData = signal<any>({});
	public generalOptions: any = {
		indexAxis: 'x',
		plugins: {
			legend: {
				labels: {
					color: '#000000',
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: '#000000',
				},
			},
			y: {
				ticks: {
					color: '#000000',
				},
			},
		},
	};

	public getStartMonitoringName() {
		return `${this.startMonitoring?.name} [${dayjs(this.startMonitoring?.coverageDate).utc().format('DD/MM/YYYY')}]`;
	}

	public getEndMonitoringName() {
		return `${this.endMonitoring?.name} [${dayjs(this.endMonitoring?.coverageDate).utc().format('DD/MM/YYYY')}]`;
	}

	public calculateGeneral() {
		let total1 = 0,
			total2 = 0;
		this.baseData.forEach((x: any) => {
			if (!x.mun) return;
			total1 += x.sup_1;
			total2 += x.sup_2;
		});

		let data: any = {};

		data.labels = [
			dayjs(this.startMonitoring?.coverageDate).utc().format('DD/MM/YYYY'),
			dayjs(this.endMonitoring?.coverageDate).utc().format('DD/MM/YYYY'),
		];
		data.datasets = [];
		data.datasets.push({
			label: `Superficie (ha)`,
			backgroundColor: ['#1212ff', '#1240af'],
			data: [total1, total2],
		});

		this.generalData.set(data);
	}
}
