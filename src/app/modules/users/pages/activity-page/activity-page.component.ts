import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LogActivity, LogActivityParams } from '@modules/users/interfaces';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { ACTIVITY_TABLE_COLUMNS } from '@modules/users/constants';
import { LogActivityService } from '@modules/users/services/log-activity.service';
import { TableModule } from 'primeng/table';

@Component({
	selector: 'app-activity-list',
	imports: [
		FormsModule,
		DatePipe,
		FilterBarComponent,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
	],
	templateUrl: './activity-page.component.html',
	styleUrl: './activity-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPageComponent extends BaseListFiltersComponent<LogActivity> {
	override tableColumns: ColumnTableModel[] = ACTIVITY_TABLE_COLUMNS;
	override filters = new LogActivityParams();
	override service = inject(LogActivityService);
	override formDialog?: Type<any> | undefined;

	constructor() {
		super();
		this.addBreadcrub({ label: 'Actividades', routerLink: '/users/log-activities' });
	}

	override onActionClick(_: ActionClickEvent): void {}
}
