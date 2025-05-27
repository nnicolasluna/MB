import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExtendedMenuItem } from '../../interfaces/menu-item.interface';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PrimeIcons } from 'primeng/api';
import { PermissionDirective } from '@shared/directives';
import { USER_MENU_ENTRIES } from '@modules/users/constants';
import { MAP_DATA_MENU_ENTRIES } from '@modules/map-data/constants';
import { GEOVISOR_MENU_ENTRIES } from '@modules/geovisor/constants';
import { MONITORING_MENU_ENTRIES } from '@modules/monitoring/constants/module-menu-entries';

@Component({
	selector: 'app-menu',
	imports: [CommonModule, MenuItemComponent, PermissionDirective],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
	model: ExtendedMenuItem[] = [];

	ngOnInit() {
		this.model = [
			{
				label: '',
				isPublic: true,
				items: [{ label: 'Inicio', class: 'flex justify-center', icon: PrimeIcons.HOME, routerLink: ['/home'] }],
			},
			{
				label: 'Módulos',
				isPublic: true,
				items: [USER_MENU_ENTRIES /* MAP_DATA_MENU_ENTRIES, MONITORING_MENU_ENTRIES, GEOVISOR_MENU_ENTRIES */],
			},
		];
	}
}
