import { Component, inject, Type } from '@angular/core';
import { DocsService } from '@modules/docs/services/docs.service';
import { ROLE_TABLE_COLUMNS } from '@modules/users/constants';
import { Role, RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { OfficialCreateFormComponent } from '../official/components/official-create-form/official-create-form.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { GroupService } from '@modules/members/services/group.service';
import { WORKING_TABLE_COLUMNS } from '@modules/docs/constants/working';
import { Router } from '@angular/router';

@Component({
	selector: 'app-working-group',
	imports: [
		FormsModule,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
	],
	templateUrl: './working-group.component.html',
	styleUrl: './working-group.component.scss',
})
export class WorkingGroupComponent extends BaseListFiltersComponent<Role> {
	override tableColumns: ColumnTableModel[] = WORKING_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(GroupService);
	override formDialog: Type<any> = OfficialCreateFormComponent;
	constructor(private router: Router) {
		super();
		this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
		this.addBreadcrub({ label: 'Documentos por Grupo de Trabajo', routerLink: '/docs/workingGroup' });
	}
	override onActionClick({ data, action }: ActionClickEvent) { }
	agregarReunion(nombre: string, id: number) {
		this.router.navigate(['docs/working-group-docs']);
	}
}
