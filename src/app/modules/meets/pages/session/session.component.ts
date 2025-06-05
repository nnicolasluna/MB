import { Component } from '@angular/core';
import { CalendarComponent } from '../../../../shared/components/calendar/calendar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { UserModel } from '@modules/users/interfaces';

@Component({
	selector: 'app-session',
	imports: [CalendarComponent, BreadcrumbModule, ButtonModule],
	templateUrl: './session.component.html',
	styleUrl: './session.component.scss',
})
export class SessionComponent {
	constructor() {}
}
