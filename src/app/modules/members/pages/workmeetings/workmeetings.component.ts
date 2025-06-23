import { Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GROUP_TABLE_COLUMNS } from '@modules/members/constants/group';
import { GroupModel } from '@modules/members/interfaces/user.interface';
import { GroupService } from '@modules/members/services/group.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { GroupCreateFormComponent } from '../groups/components/group-create-form/group-create-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WORK_TABLE_COLUMNS } from '@modules/members/constants/work';
import { WorkService } from '@modules/members/services/work.service';
import { WorkFormComponent } from './components/work-form/work-form.component';

@Component({
	selector: 'app-workmeetings',
	imports: [
		FormsModule,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
	],
	templateUrl: './workmeetings.component.html',
	styleUrl: './workmeetings.component.scss',
})
export class WorkmeetingsComponent extends BaseListFiltersComponent<GroupModel> {
	title: any;
	id_group: any;
	override tableColumns: ColumnTableModel[] = WORK_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(WorkService);
	override formDialog: Type<any> = WorkFormComponent;
	constructor(private router: Router, private route: ActivatedRoute) {
		super();
		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
			this.id_group = params.get('id');
			this.addBreadcrub({ label: 'Miembros y Comite', routerLink: '' });
			this.addBreadcrub({ label: 'Grupos de Trabajo', routerLink: '/members/group' });
			this.addBreadcrub({ label: this.title, routerLink: '' });
		});
	}
	override onActionClick({ data, action }: ActionClickEvent) {}
}
