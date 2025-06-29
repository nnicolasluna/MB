import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ExtendedMenuItem } from '../../interfaces/menu-item.interface';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PrimeIcons } from 'primeng/api';
import { PermissionDirective } from '@shared/directives';
import { USER_MENU_ENTRIES } from '@modules/users/constants';
import { MEETS_MENU_ENTRIES } from '@modules/meets/constants/medulo-menu-meets';
import { DOCS_MENU_ENTRIES } from '@modules/docs/constants/medulo-menu-docs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProfileComponent } from '../profile/profile.component';
import { AuthService } from '@modules/auth/services/auth.service';
import { MEMBERS_MENU_ENTRIES } from '@modules/members/constants/modulo-menu-members';
import { EVENTS_MENU_ENTRIES } from '@modules/monitoring/constants/modulo-menu-events';

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
				isPublic: true,
				separator: true,
			},
			{
				label: '',
				isPublic: true,
				items: [USER_MENU_ENTRIES],
			},
			{
				label: '',
				isPublic: true,
				items: [MEETS_MENU_ENTRIES],
			},
			{
				label: '',
				isPublic: true,
				items: [MEMBERS_MENU_ENTRIES],
			},
			{
				label: '',
				isPublic: true,
				items: [EVENTS_MENU_ENTRIES],
			},
			{
				label: '',
				isPublic: true,
				items: [DOCS_MENU_ENTRIES],
			},
			
			{
				isPublic: true,
				separator: true,
			},
			{
				label: 'profile',
				isPublic: true,
				items: [{ label: 'Configuración de Perfil', class: 'text-sm flex justify-center', icon: PrimeIcons.USER }],
			},
			{
				label: 'logout',
				isPublic: true,
				items: [{ label: 'Log Out', class: 'text-sm flex justify-center', icon: PrimeIcons.SIGN_OUT }],
			},
		];
	}
	private _cdr = inject(ChangeDetectorRef);
	private _ds = inject(DialogService);
	private _dialogRef!: DynamicDialogRef;

	private _modalConfig: DynamicDialogConfig = {
		header: 'Perfil',
		modal: true,
		closable: true,
		maximizable: true,
		contentStyle: { overflow: 'auto' },
		width: '65vw',
		breakpoints: {
			'960px': '75vw',
			'640px': '90vw',
		},
	};

	public showProfile() {
		this._dialogRef = this._ds.open(ProfileComponent, this._modalConfig);
		this._dialogRef.onClose.subscribe(() => {
			this._dialogRef?.destroy();
			this._cdr.detectChanges();
		});
	}

	private _authService = inject(AuthService);

	public logout() {
		this._authService.logout();
	}
}
