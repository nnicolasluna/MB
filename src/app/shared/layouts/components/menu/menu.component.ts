import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExtendedMenuItem } from '../../interfaces/menu-item.interface';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PrimeIcons } from 'primeng/api';
import { PermissionDirective } from '@shared/directives';
import { USER_MENU_ENTRIES } from '@modules/users/constants';

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
				items: [USER_MENU_ENTRIES],
			},
		];
	}
}
