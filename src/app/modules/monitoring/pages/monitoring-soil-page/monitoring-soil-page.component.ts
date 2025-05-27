import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	BigTableMonitoringComponent,
	BigTableMonitoringItem,
} from '@modules/monitoring/components/big-table-monitoring/big-table-monitoring.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
	selector: 'app-monitoring-soil-page',
	imports: [BreadcrumbModule, BigTableMonitoringComponent],
	templateUrl: './monitoring-soil-page.component.html',
	styleUrls: ['./monitoring-soil-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringSoilPageComponent {
	public breadCrumbs: MenuItem[] = [{ icon: 'pi pi-home', routerLink: '/' }];

	public items: BigTableMonitoringItem[] = [
		{
			color: '#cc853e',
			redirectUrl: '/monitoring/use-land',
			name: 'Uso de Suelo',
			icon: '/img/icons/monitoring_land_use.svg',
		},
		{
			color: '#e4a05b',
			redirectUrl: '/monitoring/soil/alerts',
			name: 'Alertas de Suelo',
			icon: '/img/icons/soil_alerts.png',
		},
	];

	constructor() {
		this.breadCrumbs.push({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.breadCrumbs.push({ label: 'Monitoreo de Uso de Suelo', routerLink: ['/monitoring/soil'] });
	}
}
