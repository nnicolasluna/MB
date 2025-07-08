import { Component, effect, inject, signal, Type } from '@angular/core';
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
import { TableLazyLoadEvent } from 'primeng/table';

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
	group = signal<any[]>([]);
	totalRecordswork = signal<number>(0);
	override tableColumns: ColumnTableModel[] = WORK_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(WorkService);
	override formDialog: Type<any> = WorkFormComponent;
	constructor(private router: Router, private route: ActivatedRoute) {
		super();

		this.addBreadcrub({ label: 'Miembros y Comite', routerLink: '' });
		this.addBreadcrub({ label: 'Grupos de Trabajo', routerLink: '/members/group' });
	}
	override onActionClick({ data, action }: ActionClickEvent) {
		if (!data?.item?.id) return;
		const { item } = data;
		switch (action) {
			case ActionType.VIEW:
				this.showDialogForm('Visualizar', { item, isViewMode: true });
				break;
			case ActionType.EDIT:
				this.showDialogForm('Editar', { item });
				break;
			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
					next: () => {
						this.ts.success('Eliminado correctamente');
						this.loadGroup(this.id_group);
					},
					error: () => {
						this.ts.error('Error al eliminar');
					},
				});
				break;
		}
	}

	loadGroup(id: any) {
		this.service.getByIdPaginate(id, this.filters).subscribe({
			next: (res) => {
				this.group.set(res.items);
				this.totalRecords.set(res.total);
			},
			error: (err) => {
				this.group.set([]);
				this.totalRecords.set(0);
			},
		});
	}
	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
			this.id_group = params.get('id');
			this.addBreadcrub({ label: this.title, routerLink: '' });
		});
		this.loadGroup(this.id_group);
	}
	onReloadPage() {
		this.loadGroup(this.id_group);
	}
	onLazyLoadWork(event: TableLazyLoadEvent) {
		this.filters.defineFromDataViewLazyLoadEvent(event);
		this.loadGroup(this.id_group);

		/* this.list(); */
	}
	override showDialogForm(header: string, data?: any, dialog = this.formDialog) {
		if (!dialog) return;
		this.modalConfig.data = data ?? {};
		this.modalConfig.data.columns = this.requiredColumns;
		this.modalConfig.data.service = this.service;
		this.modalConfig.header = header;
		this.formDialogRef = this.ds.open(dialog, this.modalConfig);

		this.formDialogRef.onClose.subscribe((data) => {
			if (data) this.loadGroup(this.id_group);
			this.formDialogRef?.destroy();
			this.cdr.detectChanges();
		});
	}
}
