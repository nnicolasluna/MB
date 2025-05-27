import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MonitoringRiskFireService } from '@modules/monitoring/services/monitoring-risk-fire.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MonitoringRiskFire } from '@modules/monitoring/interfaces/monitoring-risk-fire/monitoring-risk-fire.interface';
import { DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import {
	BaseMonitoringStadisticsComponent,
	SettableStateField,
} from '../base-monitoring/base-monitoring-stadistics.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { SliderModule } from 'primeng/slider';
import { DatePickerModule } from 'primeng/datepicker';
import dayjs from 'dayjs';

@Component({
	selector: 'app-geo-monitoring-fire',
	imports: [
		DatePickerModule,
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
	templateUrl: './geo-monitoring-fire.component.html',
	styleUrl: './geo-monitoring-fire.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoMonitoringRiskComponent extends BaseMonitoringStadisticsComponent<MonitoringRiskFire> {
	override baseData: any;

	public service = inject(MonitoringRiskFireService);
	public monitorinOptionsRs = rxResource({
		loader: () => this._geovisorService.getMonitoringRisk(),
		defaultValue: { items: [], total: 0 },
	});

	protected override currentLayerField: SettableStateField = 'fireRiskLayer';
	protected override monitoringType: string = 'risk';

	override ngOnDestroy(): void {
		this.timelineService.setTimelineData([], '');
	}

	constructor() {
		super();
		effect(() => {
			if (!this.monitorinOptionsRs.isLoading()) {
				this.selectedValue = this.monitorinOptionsRs.value().items[0];
				let today = dayjs().utc();
				const utcDate = dayjs(this.monitorinOptionsRs.value().items[0].coverageDate).utc();
				const minDate = new Date();
				minDate.setFullYear(utcDate.year(), utcDate.month(), utcDate.date());
				this.maxDate = minDate;

				const idx = this.monitorinOptionsRs.value().items.length - 1;
				if (idx >= 0) {
					today = dayjs(this.monitorinOptionsRs.value().items[idx].coverageDate).utc();
					const maxDate = new Date();
					maxDate.setFullYear(today.year(), today.month(), today.date());
					this.minDate = maxDate;
				}

				this.showTimeline();
				this.loadData();
			}
		});
	}

	public showTimeline() {
		this._geovisorState.area.set(this.munTotalArea);

		this.timelineService.setTimelineData(
			this.monitorinOptionsRs.value().items.map((x: MonitoringRiskFire) => {
				return {
					bbox: JSON.parse(x.bbox),
					name: x.name,
					coverageDate: x.coverageDate,
					id: x.id,
					layer: x.layer,
					styleName: x.styleName,
				};
			}),
			'risk',
		);
	}

	public ngOnInit(): void {}

	public override loadData() {
		this.service.getStadistics(this.selectedValue!.uuid).subscribe({
			next: (res: any) => {
				this.baseData = res.data;
				this.calculateAreas();
				this._geovisorState.area.set(null);
				this.calculatePercentageData();
				this.calculateData();
			},
			error: (err: any) => {
				console.error(err);
			},
		});
	}

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

	public highColor = '#fd1b1a';
	public extremeColor = '#8a0a09';

	public calculatePercentageData() {
		let extreme = 0,
			high = 0;
		this.baseData.forEach((x: any) => {
			if (!x.mun) return;
			if (x.leyenda === 'Muy Alto') high += x.sup;
			else if (x.leyenda === 'Extremo') extreme += x.sup;
		});

		let total = extreme + high;
		let extremePercentage = (extreme / total) * 100;
		let highPercentage = (high / total) * 100;

		let data: any = {};

		data.labels = [`Muy Alto (${highPercentage.toPrecision(5)}%)`, `Extremo (${extremePercentage.toPrecision(5)}%)`];
		data.datasets = [];
		data.datasets.push({
			backgroundColor: [this.highColor, this.extremeColor],
			data: [highPercentage, extremePercentage],
		});

		this.percentageData.set(data);
	}

	public override calculateProvData(provinces: string[]) {
		const provData = provinces
			.map((prov) => {
				let extreme = 0,
					high = 0;
				this.baseData.forEach((x: any) => {
					if (x.prov === prov) {
						if (x.leyenda === 'Extremo') extreme += x.sup;
						else if (x.leyenda === 'Muy Alto') high += x.sup;
					}
				});

				return {
					name: prov,
					extreme: (extreme / (extreme + high)) * 100,
					high: (high / (extreme + high)) * 100,
				};
			})
			.sort((a, b) => {
				return b.high - a.high;
			});

		let data: any = {};

		data.labels = provData.map((x) => x.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Extremo (%)',
			backgroundColor: this.extremeColor,
			data: provData.map((x) => x.extreme),
		});
		data.datasets.push({
			label: 'Muy Alto (%)',
			backgroundColor: this.highColor,
			data: provData.map((x) => x.high),
		});

		this.provData.set(data);
	}

	public override calculateMunData(municipalities: string[]) {
		const munData = municipalities
			.map((name) => {
				let extreme = 0,
					high = 0;
				this.baseData.forEach((x: any) => {
					if (x.mun === name) {
						if (x.leyenda === 'Extremo') extreme += x.sup;
						else if (x.leyenda === 'Muy Alto') high += x.sup;
					}
				});

				return {
					name,
					extreme: (extreme / (extreme + high)) * 100,
					high: (high / (extreme + high)) * 100,
				};
			})
			.sort((a: any, b: any) => b.high - a.high);

		let data: any = {};

		data.labels = munData.map((x) => x.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Extremo (%)',
			backgroundColor: this.extremeColor,
			data: munData.map((x) => x.extreme),
		});
		data.datasets.push({
			label: 'Muy Alto (%)',
			backgroundColor: this.highColor,
			data: munData.map((x) => x.high),
		});

		this.munData.set(data);
	}

	public override calculateApsData(aps: string[]) {
		const apsData = aps
			.map((name) => {
				let extreme = 0,
					high = 0;
				this.baseData.forEach((x: any) => {
					if (x.aps === name) {
						if (x.leyenda === 'Extremo') extreme += x.sup;
						else if (x.leyenda === 'Muy Alto') high += x.sup;
					}
				});

				return {
					name,
					extreme: (extreme / (extreme + high)) * 100,
					high: (high / (extreme + high)) * 100,
				};
			})
			.sort((a: any, b: any) => b.high - a.high);

		let data: any = {};

		data.labels = apsData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Extremo (%)',
			backgroundColor: this.extremeColor,
			data: apsData.map((x) => x.extreme),
		});
		data.datasets.push({
			label: 'Muy Alto (%)',
			backgroundColor: this.highColor,
			data: apsData.map((x) => x.high),
		});

		this.apsData.set(data);
	}

	public override calculateTcosData(tcos: string[]) {
		const tcosData = tcos
			.map((name) => {
				let extreme = 0,
					high = 0;
				this.baseData.forEach((x: any) => {
					if (x.tcos === name) {
						if (x.leyenda === 'Extremo') extreme += x.sup;
						else if (x.leyenda === 'Muy Alto') high += x.sup;
					}
				});

				return {
					name,
					extreme: (extreme / (extreme + high)) * 100,
					high: (high / (extreme + high)) * 100,
				};
			})
			.sort((a: any, b: any) => b.high - a.high);

		let data: any = {};

		data.labels = tcosData.map((prov) => prov.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Extremo (%)',
			backgroundColor: this.extremeColor,
			data: tcosData.map((x) => x.extreme),
		});
		data.datasets.push({
			label: 'Muy Alto (%)',
			backgroundColor: this.highColor,
			data: tcosData.map((x) => x.high),
		});

		this.tcosData.set(data);
	}

	public override calculateRamsarData(ramsars: string[]) {
		const ramsarData = ramsars
			.map((name) => {
				let extreme = 0,
					high = 0;
				this.baseData.forEach((x: any) => {
					if (x.ramsar === name) {
						if (x.leyenda === 'Extremo') extreme += x.sup;
						else if (x.leyenda === 'Muy Alto') high += x.sup;
					}
				});

				return {
					name,
					extreme: (extreme / (extreme + high)) * 100,
					high: (high / (extreme + high)) * 100,
				};
			})
			.sort((a: any, b: any) => b.high - a.high);

		let data: any = {};

		data.labels = ramsarData.map((x) => x.name);
		data.datasets = [];
		data.datasets.push({
			label: 'Extremo (%)',
			backgroundColor: this.extremeColor,
			data: ramsarData.map((x) => x.extreme),
		});
		data.datasets.push({
			label: 'Muy Alto (%)',
			backgroundColor: this.highColor,
			data: ramsarData.map((x) => x.high),
		});

		this.ramsarData.set(data);
	}

	public maxDate = new Date();

	public minDate = new Date();

	public haveData(date: any): boolean {
		let haveData = false;
		this.monitorinOptionsRs.value().items.forEach((x: MonitoringRiskFire) => {
			const covDate = new Date(x.coverageDate);
			if (
				covDate.getUTCDate() === date.day &&
				covDate.getUTCMonth() === date.month &&
				covDate.getUTCFullYear() === date.year
			) {
				haveData = true;
			}
		});
		return haveData;
	}

	public onTodayClick(event: Date) {
		const item = this.monitorinOptionsRs.value().items.find((x: MonitoringRiskFire) => {
			const date = new Date(x.coverageDate);
			return (
				date.getUTCDate() === event.getDate() &&
				date.getUTCMonth() === event.getMonth() &&
				date.getUTCFullYear() === event.getFullYear()
			);
		});
		if (item) this.onSelectedValueChange({ value: item, originalEvent: null as any });
		else this._ts.warn('No hay datos para la fecha seleccionada');
	}
}
