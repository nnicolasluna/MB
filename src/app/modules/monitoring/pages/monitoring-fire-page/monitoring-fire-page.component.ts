import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	BigTableMonitoringComponent,
	BigTableMonitoringItem,
} from '@modules/monitoring/components/big-table-monitoring/big-table-monitoring.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
	selector: 'app-monitoring-fire-page',
	imports: [BreadcrumbModule, BigTableMonitoringComponent],
	templateUrl: './monitoring-fire-page.component.html',
	styleUrls: ['./monitoring-fire-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringFirePageComponent {
	public breadCrumbs: MenuItem[] = [{ icon: 'pi pi-home', routerLink: '/' }];

	public items: BigTableMonitoringItem[] = [
		{
			color: '#cc853e',
			redirectUrl: '/monitoring/hot-spot',
			name: 'Alerta de Incendios - Focos de Calor',
			icon: '/img/icons/fire.svg',
		},
		{
			color: '#e4a05b',
			redirectUrl: '/monitoring/fire/risk',
			name: 'Riesgo de Incendios',
			icon: '/img/icons/monitoring_fire_risk.svg',
		},
		{
			color: '#ecc196',
			redirectUrl: '/monitoring/fire/burn',
			name: 'Cicatrices de Quemas',
			icon: '/img/icons/monitoring_burn.svg',
		},
	];

	constructor() {
		this.breadCrumbs.push({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.breadCrumbs.push({ label: 'Monitoreo de Fuego', routerLink: ['/monitoring/fire'] });
	}
}
