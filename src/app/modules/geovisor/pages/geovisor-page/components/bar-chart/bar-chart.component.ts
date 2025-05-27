import { Component, input, OnInit, output, signal } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
	selector: 'app-bar-chart',
	imports: [MultiSelectModule, ChartModule],
	template: `<div>
		<div class="mt-2">
			<label>{{ label() }}: </label>
			<p-multiselect
				styleClass="mt-2"
				[options]="selectOptions()"
				[style]="{ width: '100%' }"
				[showClear]="true"
				[showToggleAll]="false"
				[filter]="true"
				appendTo="body"
				[placeholder]="'Seleccionar...'"
				(onChange)="onChangeData.emit($event.value)"
				(onClear)="onChangeData.emit([])"
				[selectionLimit]="selectionLimit()"
			>
			</p-multiselect>
		</div>
		<div style="height: 400px">
			<p-chart [type]="'bar'" height="400" [data]="chartData()" [options]="chartOptions()"> </p-chart>
		</div>
	</div>`,
})
export class BarChartComponent implements OnInit {
	public label = input.required<string>();
	public selectOptions = input.required<string[]>();
	public onChangeData = output<string[]>();

	public onBarClick = output<string>();

	public barOptions: ChartOptions = {
		events: ['click', 'mousemove'],
		interaction: {
			mode: 'point',
		},
		onClick: (_event, elements, _chart) => {
			if (!elements?.[0]) return;

			const index = elements?.[0].index;
			const label = this.chartData().labels[index];
			this.onBarClick.emit(label);
		},
		indexAxis: 'y',
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
					font: {
						weight: 500,
					},
					callback: function (val: any, _index: any, _ticks: any) {
						const tickText: any = (this as any).getLabelForValue(val);
						return tickText.length > 10 ? `${tickText.substring(0, 9)}...` : tickText;
					},
				},
			},
			y: {
				ticks: {
					color: '#000000',
					font: {
						weight: 500,
					},
					callback: function (val: any, _index: any, _ticks: any) {
						const tickText: any = (this as any).getLabelForValue(val);
						return tickText.length > 10 ? `${tickText.substring(0, 9)}...` : tickText;
					},
				},
			},
		},
	};

	public chartData = input.required<any>();
	public data = signal({});
	public chartOptions = signal<ChartOptions>(this.barOptions);
	public horizontal = input(true);
	public selectionLimit = input<number | null>(null);

	ngOnInit(): void {
		this.data.set(this.chartData());
		if (this.horizontal() == false) {
			this.chartOptions.set({
				...this.chartOptions(),
				indexAxis: 'x',
			});
		}
	}
}
