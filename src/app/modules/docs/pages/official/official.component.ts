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
	],
	templateUrl: './official.component.html',
	styleUrl: './official.component.scss',
})
export class OfficialComponent extends BaseListFiltersComponent<Role> {
	override tableColumns: ColumnTableModel[] = ROLE_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(DocsService);
	override formDialog: Type<any> = OfficialCreateFormComponent;
	constructor() {
		super();
		this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
		this.addBreadcrub({ label: 'Documentos Oficiales', routerLink: '/docs/official' });
	}
	override onActionClick({ data, action }: ActionClickEvent) { }
}
