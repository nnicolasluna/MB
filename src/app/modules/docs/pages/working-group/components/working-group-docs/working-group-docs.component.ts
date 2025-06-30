import { Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WORKING_TABLE_COLUMNS } from '@modules/docs/constants/working';
import { OfficialCreateFormComponent } from '@modules/docs/pages/official/components/official-create-form/official-create-form.component';
import { GroupService } from '@modules/members/services/group.service';
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
import { WorkingGroupDocsFormComponent } from '../working-group-docs-form/working-group-docs-form.component';
import { WorkingDocsService } from '@modules/docs/services/workingDocs.service';
import { ActivatedRoute } from '@angular/router';
import { ActionType } from '@shared/constants';
import { WorkingGroupActionComponent } from '../working-group-action/working-group-action.component';
import { firstValueFrom } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'app-working-group-docs',
	imports: [
		FormsModule,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
		WorkingGroupActionComponent,
		TooltipModule,
	],
	templateUrl: './working-group-docs.component.html',
	styleUrl: './working-group-docs.component.scss',
})
export class WorkingGroupDocsComponent extends BaseListFiltersComponent<any> {
	id_group: any;
	title: any;
	override tableColumns: ColumnTableModel[] = WORKING_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(WorkingDocsService);
	_service = inject(WorkingDocsService);
	override formDialog: Type<any> = WorkingGroupDocsFormComponent;
	constructor(private route: ActivatedRoute) {
		super();
		this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
		this.addBreadcrub({ label: 'Documentos por Grupo de Trabajo', routerLink: '/docs/workingGroup' });
	}

	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			this.id_group = params.get('id');
			this.title = params.get('name');
			this.addBreadcrub({ label: this.title, routerLink: '' });
		});
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
	downloadFile = async (filename: string) => {
		try {
			const token = localStorage.getItem('token')!;
			const response = await firstValueFrom(this._service.downloadFile(filename, token));
			const url = window.URL.createObjectURL(response);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error al descargar:', error);
		}
	};
}
