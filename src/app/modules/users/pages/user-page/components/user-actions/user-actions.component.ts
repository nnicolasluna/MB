import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserStatus } from '@modules/users/constants';
import { UserModel } from '@modules/users/interfaces';
import { BaseActionsComponent } from '@shared/components';
import { ActionsMenuComponent } from '@shared/components/actions-menu/actions-menu.component';
import { ActionType } from '@shared/constants';
import { ResourceTypes } from '@shared/constants/resources';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-user-actions',
    imports: [ActionsMenuComponent, ButtonModule, TooltipModule, MenuModule],
    templateUrl: './user-actions.component.html',
    styleUrl: './user-actions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActionsComponent extends BaseActionsComponent<UserModel> {
	public resource = ResourceTypes.USERS;

	override buildActions(): void {
		this.actions = [];

		this.pushAction(
			{
				label: 'Ver',
				icon: 'pi pi-eye',
				styleClass: 'text-blue-600',
				command: () => {
					this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.VIEW });
				},
			},
			this._permissions.canView.bind(this._permissions),
		);

		if (this.item().userStatus === UserStatus.APROVE)
			this.pushAction(
				{
					label: 'Editar',
					icon: 'pi pi-pencil',
					styleClass: 'text-green-600',
					command: () => {
						this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.EDIT });
					},
				},
				this._permissions.canUpdate.bind(this._permissions),
			);

		if (this.item().userStatus === UserStatus.APROVE && !this.item().reviwedVerificationCode)
			this.pushAction(
				{
					label: 'Reenviar activación',
					icon: 'pi pi-send',
					styleClass: 'text-yellow-600',
					command: () => {
						this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.SEND_EMAIL });
					},
				},
				this._permissions.canUpdate.bind(this._permissions),
			);

		if (this.item().userStatus === UserStatus.APROVE)
			this.pushAction(
				{
					label: 'Deshabilitar',
					icon: 'pi pi-trash',
					styleClass: 'text-red-600',
					command: () => {
						this._cs.confirmDelete({
							header: 'Deshabilitar usuario',
							message: '¿Está seguro de que desea deshabilitar este usuario?',
							accept: () => {
								this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.DISABLE });
							},
						});
					},
				},
				this._permissions.canUpdate.bind(this._permissions),
			);

		if (this.item().userStatus === UserStatus.PENDING)
			this.pushAction(
				{
					label: 'Aprobar',
					icon: 'pi pi-check',
					styleClass: 'text-green-600',
					command: () => {
						this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.APPROVE });
					},
				},
				this._permissions.canUpdate.bind(this._permissions),
			);

		if (this.item().userStatus === UserStatus.PENDING)
			this.pushAction(
				{
					label: 'Rechazar',
					icon: 'pi pi-times',
					styleClass: 'text-red-600',
					command: () => {
						this._cs.confirmDelete({
							header: 'Rechazar usuario',
							message: '¿Está seguro de rechazar el usuario?',
							accept: () => {
								this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.REJECT });
							},
						});
					},
				},
				this._permissions.canUpdate.bind(this._permissions),
			);

		if (this.item().userStatus === UserStatus.DISABLED || this.item().userStatus === UserStatus.REJECT)
			this.pushAction(
				{
					label: 'Habilitar',
					icon: 'pi pi-check',
					styleClass: 'text-green-600',
					command: () => {
						this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.ENABLE });
					},
				},
				this._permissions.canUpdate.bind(this._permissions),
			);

		if (this.item().userStatus === UserStatus.REJECT || this.item().userStatus === UserStatus.DISABLED)
			this.pushAction(
				{
					label: 'Eliminar',
					icon: 'pi pi-trash',
					styleClass: 'text-red-600',
					command: () => {
						this._cs.confirmDelete({
							accept: () => {
								this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.DELETE });
							},
						});
					},
				},
				this._permissions.canDelete.bind(this._permissions),
			);
	}
}
