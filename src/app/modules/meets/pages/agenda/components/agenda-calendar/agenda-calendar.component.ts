import { Component, inject, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '@modules/meets/services/activity.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent } from '@shared/components';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';
import { ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FormActividadesComponent } from '../form-actividades/form-actividades.component';
import { AGENDA_TABLE_COLUMNS } from '@modules/meets/constants/agenda';

@Component({
	selector: 'app-agenda-calendar',
	imports: [BreadcrumbModule, CalendarComponent, ButtonModule],
	templateUrl: './agenda-calendar.component.html',
	styleUrl: './agenda-calendar.component.scss',
})
export class AgendaCalendarComponent extends BaseListFiltersComponent<any> {
	title: any;
	override tableColumns: ColumnTableModel[] = AGENDA_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(ActivityService);
	override formDialog: Type<any> = FormActividadesComponent;
	override onActionClick(): void { }
	constructor(private route: ActivatedRoute) {
		super();
		this.addBreadcrub({ label: 'Reuniones y Convocatorias', routerLink: '' });
		this.addBreadcrub({ label: 'Administración de Agenda', routerLink: '/meets/agenda' });
	}
	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
			this.addBreadcrub({ label: this.title, routerLink: '/meets/agenda/calendar' });
		});
	}
}
