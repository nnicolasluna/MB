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
	data = [
		{
			Fecha: '15/02/2025',
			Objetivo: 'Revisar los avances del plan de reforestación en la zona norte.',
			ESTADO: 'EN PROGRESO',
			reunionExtraOrdinaria: false,
		},
		{
			Fecha: '15/02/2025',
			Objetivo: 'Discutir estrategias para la prevención de incendios forestales.',
			ESTADO: 'EN PROGRESO',
			reunionExtraOrdinaria: false,
		},
		{
			Fecha: '10/06/2025',
			Objetivo: 'Evaluar el impacto de las nuevas regulaciones ambientales.',
			ESTADO: 'PENDIENTE',
			reunionExtraOrdinaria: false,
		},
		{
			Fecha: '05/08/2025',
			Objetivo: 'Presentar informe sobre la calidad del agua en reservas naturales.',
			ESTADO: 'REALIZADO',
			reunionExtraOrdinaria: true,
		},
		{
			Fecha: '20/09/2025',
			Objetivo: 'Definir los lineamientos para la próxima campaña de concientización ambiental.',
			ESTADO: 'EN PROGRESO',
			reunionExtraOrdinaria: false,
		},
	];
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
