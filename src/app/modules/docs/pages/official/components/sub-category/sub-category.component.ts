import { CommonModule } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WORK_TABLE_COLUMNS } from '@modules/members/constants/work';
import { WorkActionComponent } from '@modules/members/pages/workmeetings/components/work-action/work-action.component';
import { WorkFormComponent } from '@modules/members/pages/workmeetings/components/work-form/work-form.component';
import { WorkService } from '@modules/members/services/work.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';

@Component({
	selector: 'app-sub-category',
	imports: [
		FormsModule,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
		CommonModule,
	],
	templateUrl: './sub-category.component.html',
	styleUrl: './sub-category.component.scss',
})
export class SubCategoryComponent extends BaseListFiltersComponent<any> {
	title: any;
  id:any
	override tableColumns: ColumnTableModel[] = WORK_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(WorkService);
	override formDialog: Type<any> = WorkFormComponent;
	override onActionClick({ data, action }: ActionClickEvent) {}
	constructor(private route: ActivatedRoute) {
		super();
		this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
		this.addBreadcrub({ label: 'Documentos Oficiales', routerLink: '/docs/official' });
	}
	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
      this.id = params.get('id');
			this.addBreadcrub({ label: this.title, routerLink: '/meets/agenda/calendar' });
		});
	}

}
