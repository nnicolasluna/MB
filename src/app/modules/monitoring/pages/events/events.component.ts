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
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

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
	/* 	override service: BaseCRUDHttpService<any> = inject(EventService);
	 */ override service: EventService = inject(EventService);

	override formDialog: Type<any> = GroupCreateFormComponent;
	constructor() {
		super();
		this.reuniones();
		this.addBreadcrub({ label: 'Miembros y Comite', routerLink: '' });
		this.addBreadcrub({ label: 'Grupos de Trabajo', routerLink: '/members/group' });
	}
	override onActionClick({ data, action }: ActionClickEvent) {}
	reuniones() {
		this.service.fechas().subscribe({
			next: (items) => {

			},
			error: () => {
				this.isLoading.set(false);
				this.totalRecords.set(0);
				this.items1.set([]);
				this.ts.error('Error al cargar los registros');
			},
		});
	}
}
