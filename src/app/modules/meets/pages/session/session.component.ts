import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { CalendarComponent } from '../../../../shared/components/calendar/calendar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { BaseListFiltersComponent } from '@shared/components';
import { SessionModel } from '@modules/meets/interfaces/session.interface';
import { SessionFormComponent } from './session-form/session-form.component';
import { SessionService } from '@modules/meets/services/session.service';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { EventService } from '@modules/monitoring/services/events.service';
import { EVENTS_TABLE_COLUMNS } from '@modules/monitoring/constants/events';
import { WORKING_TABLE_COLUMNS } from '@modules/docs/constants/working';
import { GroupService } from '@modules/members/services/group.service';
import { BaseCRUDHttpService } from '@shared/services';
import { RoleParams } from '@modules/users/interfaces';
import { OfficialCreateFormComponent } from '@modules/docs/pages/official/components/official-create-form/official-create-form.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-session',
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
	templateUrl: './session.component.html',
	styleUrl: './session.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionComponent extends BaseListFiltersComponent<any> {
	override tableColumns: ColumnTableModel[] = WORKING_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(GroupService);
	override formDialog: Type<any> = OfficialCreateFormComponent;
	constructor(private router: Router) {
		super();
		this.addBreadcrub({ label: 'Reuniones y Convocatorias', routerLink: '' });
		this.addBreadcrub({ label: 'Administración de Sesiones', routerLink: '/meets/session' });
	}
	override onActionClick({ data, action }: ActionClickEvent) {}
	agregarReunion(nombre: string, id: number) {
		this.router.navigate(['meets/activitiesByGroup', nombre, id]);
	}
	
}
