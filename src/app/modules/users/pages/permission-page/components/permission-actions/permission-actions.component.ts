import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Permission } from '@modules/users/interfaces';
import { BaseActionsComponent } from '@shared/components';
import { ActionsMenuComponent } from '@shared/components/actions-menu/actions-menu.component';
import { ActionType, ResourceTypes } from '@shared/constants';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-permission-actions',
    imports: [ActionsMenuComponent, ButtonModule, TooltipModule, MenuModule],
    templateUrl: './permission-actions.component.html',
    styleUrl: './permission-actions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionActionsComponent extends BaseActionsComponent<Permission> {
	override resource: ResourceTypes = ResourceTypes.SYSTEM_PERMISSIONS;

	override buildActions(): void {
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
