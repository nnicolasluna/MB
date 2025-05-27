import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Role } from '@modules/users/interfaces';
import { BaseActionsComponent } from '@shared/components';
import { ActionsMenuComponent } from '@shared/components/actions-menu/actions-menu.component';
import { ActionType, ResourceTypes } from '@shared/constants';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-role-actions',
    imports: [ActionsMenuComponent, ButtonModule, TooltipModule, MenuModule],
    templateUrl: './role-actions.component.html',
    styleUrl: './role-actions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleActionsComponent extends BaseActionsComponent<Role> {
	override resource: ResourceTypes = ResourceTypes.ROLES;

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
				label: 'Permisos',
				icon: 'pi pi-key',
				styleClass: 'text-yellow-600',
				command: () => {
					this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.PERMISSION });
				},
			},
			(_) => this._permissions.canCreate(ResourceTypes.SYSTEM_PERMISSIONS),
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
