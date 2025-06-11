import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { CalendarComponent } from '../../../../shared/components/calendar/calendar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { BaseListFiltersComponent } from '@shared/components';
import { SessionModel } from '@modules/meets/interfaces/session.interface';
import { SessionFormComponent } from './session-form/session-form.component';
import { SessionService } from '@modules/meets/services/session.service';
import { ActionClickEvent } from '@shared/interfaces';

@Component({
	selector: 'app-session',
	imports: [
		CalendarComponent,
		BreadcrumbModule,
		ButtonModule],
	templateUrl: './session.component.html',
	styleUrl: './session.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SessionComponent extends BaseListFiltersComponent<SessionModel> {
	override formDialog: Type<any> = SessionFormComponent;
	override tableColumns: any
	override filters: any
	override service = inject(SessionService)
	constructor() {
		super();
		this.addBreadcrub({ label: 'Reuniones y Convocatorias', routerLink: '' });
		this.addBreadcrub({ label: 'Administración de Sesiones', routerLink: '/meets/session' });
	}
	override onActionClick({ data, action }: ActionClickEvent) { }
}
