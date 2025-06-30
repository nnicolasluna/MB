import { CommonModule } from '@angular/common';
import { Component, inject, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ACTIVITY_GROUPS_TABLE_COLUMNS } from '@modules/meets/constants/activity';
import { ActivityService } from '@modules/meets/services/activity.service';
import { GroupCreateFormComponent } from '@modules/members/pages/groups/components/group-create-form/group-create-form.component';
import { GroupService } from '@modules/members/services/group.service';
import { EVENTS_TABLE_COLUMNS } from '@modules/monitoring/constants/events';
import { ACTIVITY_TABLE_COLUMNS } from '@modules/users/constants';
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
import { TooltipModule } from 'primeng/tooltip';
import { FormActividadesComponent } from '../../agenda/components/form-actividades/form-actividades.component';
import { GroupActionFormComponent } from "../../../../members/pages/groups/components/group-action-form/group-action-form.component";
import { ActionType } from '@shared/constants';

@Component({
	selector: 'app-activity',
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
		TooltipModule,
		GroupActionFormComponent
	],
	templateUrl: './activity.component.html',
	styleUrl: './activity.component.scss',
})
export class ActivityComponent extends BaseListFiltersComponent<any> {
	items1 = signal<any[]>([]);
	override tableColumns: ColumnTableModel[] = ACTIVITY_GROUPS_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(ActivityService);
	title: any;
	id_group: any;
	sesiones: any
	override formDialog: Type<any> = FormActividadesComponent;
	constructor(private route: ActivatedRoute) {
		super();
		this.addBreadcrub({ label: 'Reuniones y Convocatorias', routerLink: '' });
		this.addBreadcrub({ label: 'Administración de Sesiones', routerLink: '/meets/session' });
	}
	override onActionClick({ data, action }: ActionClickEvent) {
		if (!data?.item?.id) return;
		const { item } = data;
		switch (action) {
			case ActionType.VIEW:
				console.log(data)
				this.showDialogForm('Visualizar Actividad', { item, isViewMode: true, sesionesMBC: this.sesiones });
				break;

			case ActionType.EDIT:
				this.showDialogForm('Editar Actividad', { item, sesionesMBC: this.sesiones });
				break;
			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
					next: () => {
						this.ts.success('Permiso correctamente');
						this.list();
					},
					error: () => {
						this.ts.error('Error al eliminar');
					},
				});
				break;
		}
	}
	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
			this.id_group = params.get('id');
			this.sesiones = params.get('mesa');
			this.addBreadcrub({ label: this.title, routerLink: '' });
		});
	}
	override list() {
		this.isLoading.set(true);

		this.service.getById(this.id_group).subscribe({
			next: (items) => {
				this.items.set([...items.items]);
				this.totalRecords.set(items.total);
				this.isLoading.set(false);
			},
			error: () => {
				this.isLoading.set(false);
				this.totalRecords.set(0);
				this.items.set([]);
				this.ts.error('Error al cargar los registros');
			},
		});
	}
}
