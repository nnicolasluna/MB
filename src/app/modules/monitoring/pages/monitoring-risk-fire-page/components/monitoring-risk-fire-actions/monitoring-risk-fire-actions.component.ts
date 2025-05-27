import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapData } from '@modules/map-data/interfaces';
import { ActionsMenuComponent, BaseActionsComponent } from '@shared/components';
import { ActionType, ResourceTypes } from '@shared/constants';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'app-monitoring-risk-fire-actions',
	imports: [ActionsMenuComponent, ButtonModule, TooltipModule, MenuModule],
	templateUrl: './monitoring-risk-fire-actions.component.html',
	styleUrl: './monitoring-risk-fire-actions.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringRiskFireActionsComponent extends BaseActionsComponent<MapData> {
	override resource: ResourceTypes = ResourceTypes.MENU_MONITORING;

	constructor() {
		super();
	}

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

		if (this.item()?.bbox)
			this.pushAction(
				{
					label: 'Descargar',
					icon: 'pi pi-download',
					styleClass: 'text-green-600',
					command: () => {
						this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.DOWNLOAD });
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
