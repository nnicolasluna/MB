import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

export interface BigTableMonitoringItem {
	icon?: string;
	color: string;
	redirectUrl: string;
	name: string;
}

@Component({
	selector: 'app-big-table-monitoring',
	imports: [TableModule, ButtonModule, RouterLink],
	templateUrl: './big-table-monitoring.component.html',
	styleUrls: ['./big-table-monitoring.component.css'],
})
export class BigTableMonitoringComponent {
	public items = input.required<BigTableMonitoringItem[]>();
}
