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
import { HttpStatusCode } from '@angular/common/http';
import { ActionType } from '@shared/constants';
import { TableModule } from 'primeng/table';
import { RoleFormComponent } from '@modules/users/pages/roles-page/component/role-form/role-form.component';
import { OfficialCreateFormComponent } from './components/official-create-form/official-create-form.component';
import { DocsService } from '@modules/docs/services/docs.service';
import { OfficialActionComponent } from './components/official-action/official-action.component';
import { Router } from '@angular/router';
@Component({
	selector: 'app-official',
	imports: [
		FormsModule,
		FilterBarComponent,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
		OfficialActionComponent,
	],
	templateUrl: './official.component.html',
	styleUrl: './official.component.scss',
})
export class OfficialComponent extends BaseListFiltersComponent<Role> {
	override tableColumns: ColumnTableModel[] = ROLE_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(DocsService);
	override formDialog: Type<any> = OfficialCreateFormComponent;
	constructor(private router: Router) {
		super();
		this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
		this.addBreadcrub({ label: 'Documentos Oficiales', routerLink: '/docs/official' });
	}
	override onActionClick({ data, action }: ActionClickEvent) {
		if (!data?.item?.id) return;
		const { item } = data;
		switch (action) {
			case ActionType.VIEW:
				console.log(data);
				this.showDialogForm('Visualizar Documento Oficial', { item, isViewMode: true });
				break;

			case ActionType.EDIT:
				this.showDialogForm('Editar Documento Oficial', { item });
				break;
			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
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
	  agregar(nombre: string, id: number) {
		this.router.navigate(['docs/sub-category', nombre, id]);
	}
}
