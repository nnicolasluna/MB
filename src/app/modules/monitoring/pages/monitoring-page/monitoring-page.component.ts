import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	BigTableMonitoringComponent,
	BigTableMonitoringItem,
} from '@modules/monitoring/components/big-table-monitoring/big-table-monitoring.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
	selector: 'app-monitoring-page',
	imports: [BreadcrumbModule, BigTableMonitoringComponent],
	templateUrl: './monitoring-page.component.html',
	styleUrls: ['./monitoring-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPageComponent {
	public breadCrumbs: MenuItem[] = [{ icon: 'pi pi-home', routerLink: '/' }];

	public items: BigTableMonitoringItem[] = [
		{
			color: '#744d26',
			redirectUrl: '/monitoring/soil',
			name: 'Cambio de Uso de Suelo',
			icon: '/img/icons/monitoring_land_use.svg',
		},
		{
			color: '#a27a52',
			redirectUrl: '/monitoring/fire',
			name: 'Monitoreo de Fuego',
			icon: '/img/icons/monitoring_fire.svg',
		},
		{
			color: '#d5ae86',
			redirectUrl: '/monitoring/soil/soil-degradation',
			name: 'Monitoreo de Degradación de Suelo',
			icon: '/img/icons/monitoring_soil_degradation.svg',
		},
		{
			color: '#f2d2b2',
			redirectUrl: '/monitoring/water',
			name: 'Monitoreo de Cuerpos de Agua',
			icon: '/img/icons/monitoring_water.svg',
		},
	];

	constructor() {
		this.breadCrumbs.push({ label: 'Monitoreo', routerLink: ['/monitoring'] });
	}
}
