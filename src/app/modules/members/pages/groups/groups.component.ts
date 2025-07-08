import { Component, inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
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
import { GroupCreateFormComponent } from './components/group-create-form/group-create-form.component';
import { GroupModel } from '@modules/members/interfaces/user.interface';
import { GroupService } from '@modules/members/services/group.service';
import { GROUP_TABLE_COLUMNS } from '@modules/members/constants/group';
import { Router } from '@angular/router';
import { GroupActionFormComponent } from './components/group-action-form/group-action-form.component';
import { ActionType } from '@shared/constants';
import { TooltipModule } from 'primeng/tooltip';
@Component({
	selector: 'app-groups',
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
		GroupActionFormComponent,
		TooltipModule,
	],
	templateUrl: './groups.component.html',
	styleUrl: './groups.component.scss',
})
export class GroupsComponent extends BaseListFiltersComponent<GroupModel> {
	override tableColumns: ColumnTableModel[] = GROUP_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(GroupService);
	override formDialog: Type<any> = GroupCreateFormComponent;
	constructor(private router: Router) {
		super();
		this.addBreadcrub({ label: 'Miembros y Comite', routerLink: '' });
		this.addBreadcrub({ label: 'Grupos de Trabajo', routerLink: '/members/group' });
	}
	override onActionClick({ data, action }: ActionClickEvent) {
		if (!data?.item?.id) return;
		const { item } = data;
		switch (action) {
			case ActionType.VIEW:
				console.log(data);
				this.showDialogForm('Visualizar Grupo', { item, isViewMode: true });
				break;

			case ActionType.EDIT:
				this.showDialogForm('Editar Grupo', { item });
				break;
			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
					next: () => {
						this.ts.success('Eliminado correctamente');
						this.list();
					},
					error: () => {
						this.ts.error('Error al eliminar');
					},
				});
				break;
		}
	}
	agregarReunion(nombre: string, id: number) {
		this.router.navigate(['members/work-meetings', nombre, id]);
	}
}
