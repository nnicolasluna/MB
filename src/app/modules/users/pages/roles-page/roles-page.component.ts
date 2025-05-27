import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { ROLE_TABLE_COLUMNS } from '@modules/users/constants';
import { Role } from '@modules/users/interfaces';
import { RoleParams } from '@modules/users/interfaces/roles/role.params';
import { RoleService } from '@modules/users/services/role.service';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services/base-crud-http.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RoleActionsComponent } from './component/role-actions/role-actions.component';
import { RoleFormComponent } from './component/role-form/role-form.component';
import { PermissionFormComponent } from '../permission-page/components/permission-form/permission-form.component';
import { HttpStatusCode } from '@angular/common/http';
import { ActionType } from '@shared/constants';
import { TableModule } from 'primeng/table';

@Component({
	selector: 'app-roles-list',
	imports: [
		FormsModule,
		RoleActionsComponent,
		FilterBarComponent,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
	],
	templateUrl: './roles-page.component.html',
	styleUrl: './roles-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesPageComponent extends BaseListFiltersComponent<Role> {
	override tableColumns: ColumnTableModel[] = ROLE_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<Role> = inject(RoleService);
	override formDialog: Type<any> = RoleFormComponent;

	constructor() {
		super();
		this.addBreadcrub({ label: 'Roles', routerLink: '/users/roles' });
	}

	override onActionClick({ data, action }: ActionClickEvent) {
		if (!data?.item?.id) return;
		const { item } = data;

		switch (action) {
			case ActionType.VIEW:
				this.showDialogForm('Visualizar Rol', { item, isViewMode: true });
				break;

			case ActionType.EDIT:
				this.showDialogForm('Editar Rol', { item, isViewMode: false });
				break;

			case ActionType.PERMISSION:
				this.modalConfig.data = { idRole: item.id };
				this.modalConfig.header = 'Asignar permisos';
				this.formDialogRef = this.ds.open(PermissionFormComponent, this.modalConfig);
				this.formDialogRef.onClose.subscribe(() => {
					this.formDialogRef?.destroy();
					this.cdr.detectChanges();
				});
				break;

			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
					next: () => {
						this.ts.success('Rol eliminado correctamente');
						this.list();
					},
					error: (err: any) => {
						if (err?.status === HttpStatusCode.Locked)
							this.ts.error('No se puede eliminar el rol porque tiene usuarios asignados');
						else this.ts.error('Error al eliminar el rol');
					},
				});
				break;
		}
	}
}
