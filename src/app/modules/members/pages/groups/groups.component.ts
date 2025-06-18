import { Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfficialCreateFormComponent } from '@modules/docs/pages/official/components/official-create-form/official-create-form.component';
import { DocsService } from '@modules/docs/services/docs.service';
import { ROLE_TABLE_COLUMNS } from '@modules/users/constants';
import { Role, RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { GroupCreateFormComponent } from './components/group-create-form/group-create-form.component';
import { GroupModel } from '@modules/members/interfaces/user.interface';
import { GroupService } from '@modules/members/services/group.service';

@Component({
	selector: 'app-groups',
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
	templateUrl: './groups.component.html',
	styleUrl: './groups.component.scss'
})
export class GroupsComponent extends BaseListFiltersComponent<GroupModel> {
	override tableColumns: ColumnTableModel[] = ROLE_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(GroupService);
	override formDialog: Type<any> = GroupCreateFormComponent;
	constructor() {
		super();
		this.addBreadcrub({ label: 'Miembros y Comite', routerLink: '' });
		this.addBreadcrub({ label: 'Grupos de Trabajo', routerLink: '/members/group' });
	}
	override onActionClick({ data, action }: ActionClickEvent) { }
}
