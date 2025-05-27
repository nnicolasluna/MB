import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '@modules/auth/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProfileComponent } from '../profile/profile.component';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
	selector: 'app-topbar',
	imports: [RouterModule, CommonModule, ButtonModule, CommonModule, StyleClassModule],
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
	items!: MenuItem[];

	@ViewChild('menubutton') menuButton!: ElementRef;

	@ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

	@ViewChild('topbarmenu') menu!: ElementRef;

	private _authService = inject(AuthService);

	constructor(public layoutService: LayoutService) {}

	public logout() {
		this._authService.logout();
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
}
