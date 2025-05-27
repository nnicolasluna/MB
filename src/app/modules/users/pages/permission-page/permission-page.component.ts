import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Permission, PermissionParams } from '@modules/users/interfaces';
import { ColumnTableModel, BaseParams, ActionClickEvent } from '@shared/interfaces';
import { PermissionService } from '@modules/users/services/permission.service';
import { PERMISSION_TABLE_COLUMNS } from '@modules/users/constants';
import { PermissionsService } from '@shared/services';
import { PermissionActionsComponent } from './components/permission-actions/permission-actions.component';
import { PermissionFormComponent } from './components/permission-form/permission-form.component';
import { ActionType } from '@shared/constants';
import { TableModule } from 'primeng/table';

@Component({
	selector: 'app-permission-list',
	imports: [
		FormsModule,
		PermissionActionsComponent,
		FilterBarComponent,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
	],
	templateUrl: './permission-page.component.html',
	styleUrl: './permission-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionPageComponent extends BaseListFiltersComponent<Permission> {
	private permissionsService = inject(PermissionsService);
	override tableColumns: ColumnTableModel[] = PERMISSION_TABLE_COLUMNS;
	override filters: BaseParams = new PermissionParams();
	override service = inject(PermissionService);
	override formDialog: Type<any> = PermissionFormComponent;

	constructor() {
		super();
		this.addBreadcrub({ label: 'Permisos del sistema', routerLink: '/users/permissions' });
	}

	override onActionClick({ action, data }: ActionClickEvent): void {
		const { item } = data as { item: Permission };

		switch (action) {
			case ActionType.VIEW:
				this.showDialogForm('Visualizar Permiso', { item, isViewMode: true });
				break;

			case ActionType.EDIT:
				this.showDialogForm('Editar Permiso', { item, isViewMode: false });
				break;

			case ActionType.DELETE:
				this.service.deletePermission(item.idRole, item.idResource).subscribe({
					next: () => {
						this.ts.success('Permiso eliminado correctamente');
						this.list();
					},
					error: () => {
						this.ts.error('Error al eliminar el Permiso');
					},
				});
				break;
		}
	}

	public transformPermission(permission: number) {
		const rights = this.permissionsService.parseRights(permission);
		if (rights.IS_SUPER_ADMIN) return 'Super Admin';
		let access = '';
		access += rights.IS_SUPER_ADMIN ? 'Super Admin, ' : '';
		access += rights.IS_ADMIN ? 'Admin, ' : '';
		access += rights.CAN_DELETE ? 'Puede Eliminar, ' : '';
		access += rights.CAN_CREATE ? 'Puede Crear, ' : '';
		access += rights.CAN_UPDATE ? 'Puede Actualizar, ' : '';
		access += rights.CAN_READ ? 'Puede Ver, ' : '';
		access = access.slice(0, -2);
		return access;
	}
}
