import { Component, effect, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GROUP_TABLE_COLUMNS } from '@modules/members/constants/group';
import { GroupModel } from '@modules/members/interfaces/user.interface';
import { GroupService } from '@modules/members/services/group.service';
import { RoleParams, UserParams } from '@modules/users/interfaces';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { WorkActionComponent } from './components/work-action/work-action.component';
import { ActionType } from '@shared/constants';

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
		CommonModule,
		WorkActionComponent,
	],
	templateUrl: './workmeetings.component.html',
	styleUrl: './workmeetings.component.scss',
})
export class WorkmeetingsComponent extends BaseListFiltersComponent<GroupModel> {
	title: any;
	id_group: any;
	group: any;
	override tableColumns: ColumnTableModel[] = WORK_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(WorkService);
	override formDialog: Type<any> = WorkFormComponent;
	constructor(private router: Router, private route: ActivatedRoute) {
		super();

		/* this.group = toSignal(
			this.service.getById(this.id_group).pipe(
				map((res) => res?.items ?? []),
				catchError(() => of([]))
			)
		);) */
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

	loadGroup(id: any) {
		this.service.getById(id).subscribe({
			next: (res) => {
				this.group = res;
				console.log('Group cargado:', this.group);
			},
			error: (err) => {
				console.error('Error al cargar el grupo:', err);
				this.group = [];
			},
		});
	}
	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
			this.id_group = params.get('id');
			this.loadGroup(params.get('id'));
			this.addBreadcrub({ label: 'Miembros y Comite', routerLink: '' });
			this.addBreadcrub({ label: 'Grupos de Trabajo', routerLink: '/members/group' });
			this.addBreadcrub({ label: this.title, routerLink: '' });
		});
	}
}
