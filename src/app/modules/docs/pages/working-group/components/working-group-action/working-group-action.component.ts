import { Component } from '@angular/core';
import { ActionsMenuComponent } from '../../../../../../shared/components/actions-menu/actions-menu.component';
import { BaseActionsComponent } from '@shared/components';
import { ActionType, ResourceTypes } from '@shared/constants';

@Component({
	selector: 'app-working-group-action',
	imports: [ActionsMenuComponent],
	templateUrl: './working-group-action.component.html',
	styleUrl: './working-group-action.component.scss',
})
export class WorkingGroupActionComponent extends BaseActionsComponent<any> {
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
			this._permissions.canView.bind(this._permissions)
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
			this._permissions.canUpdate.bind(this._permissions)
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
			this._permissions.canDelete.bind(this._permissions)
		);
	}
}
