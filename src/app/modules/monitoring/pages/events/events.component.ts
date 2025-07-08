import { CommonModule } from '@angular/common';
import { Component, inject, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GROUP_TABLE_COLUMNS } from '@modules/members/constants/group';
import { GroupActionFormComponent } from '@modules/members/pages/groups/components/group-action-form/group-action-form.component';
import { GroupCreateFormComponent } from '@modules/members/pages/groups/components/group-create-form/group-create-form.component';
import { GroupService } from '@modules/members/services/group.service';
import { EVENTS_TABLE_COLUMNS } from '@modules/monitoring/constants/events';
import { EventService } from '@modules/monitoring/services/events.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'app-events',
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
	],
	templateUrl: './events.component.html',
	styleUrl: './events.component.scss',
})
export class EventsComponent extends BaseListFiltersComponent<any> {
	items1 = signal<any[]>([]);
	override tableColumns: ColumnTableModel[] = EVENTS_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(EventService);
	_service = inject(EventService)

	override formDialog: Type<any> = GroupCreateFormComponent;
	constructor() {
		super();
		this.addBreadcrub({ label: 'Seguimiento de Actas', routerLink: '' });
		this.addBreadcrub({ label: 'Reuniones y Sesiones por Grupo', routerLink: '/monitoring/events' });
	}
	override onActionClick({ data, action }: ActionClickEvent) { }
	override list() {
		this.isLoading.set(true);

		this._service.fechas(this.filters).subscribe({
			next: (items) => {
				console.log(items)
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
	override onLazyLoad(event: TableLazyLoadEvent) {
		this.filters.defineFromDataViewLazyLoadEvent(event);

		this.list();
	}
	downloadFile = async (filename: string, tipo: string) => {
		try {
			if (tipo == 'acta') {
				const token = localStorage.getItem('token')!;
				const response = await firstValueFrom(this._service.downloadFile(filename, token));
				const url = window.URL.createObjectURL(response);
				const a = document.createElement('a');
				a.href = url;
				a.download = filename;
				a.click();
				window.URL.revokeObjectURL(url);
			} else {
				const token = localStorage.getItem('token')!;
				const response = await firstValueFrom(this._service.downloadFileList(filename, token));
				const url = window.URL.createObjectURL(response);
				const a = document.createElement('a');
				a.href = url;
				a.download = filename;
				a.click();
				window.URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error('Error al descargar:', error);
		}
	};
	/* deleteFile(data: any, type: string) {
		console.log(data, type)
		if (type == 'acta') {
			this._service.updateActa(data.id, { acta: '' });
		} else {
			this._service.updateList(data.id, { acta: '' });
		}

	} */
	deleteFile(data: any, type: string) {
		console.log(data, type);

		if (type == 'acta') {
			// Asegúrate de que esto es lo que se ejecuta
			this._service.updateActa(data.id, { acta: '' }).subscribe({
				next: () => {
					console.log('Acta eliminada'),
						this.list()
				},
				error: err => console.error('Error al eliminar acta', err),

			});
		} else {
			this._service.updateList(data.id, { acta: '' }).subscribe({
				next: () => {
					console.log('Acta eliminada'),
						this.list()
				},
				error: err => console.error('Error en lista', err),
			});
		}
		this.list()
	}
}
