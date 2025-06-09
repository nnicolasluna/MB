import { Component, inject, Type } from '@angular/core';
import { AgendaModel } from '@modules/meets/interfaces/agenda.interface';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent } from '@shared/components';
import { ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ROLE_TABLE_COLUMNS } from '@modules/users/constants';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '@modules/meets/services/agenda.service';
import { AgendaFormComponent } from './components/agenda-form/agenda-form.component';

@Component({
  selector: 'app-agenda',
  imports: [
    BreadcrumbModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent extends BaseListFiltersComponent<AgendaModel> {
  selectedYear: Date | undefined;
  override tableColumns: ColumnTableModel[] = ROLE_TABLE_COLUMNS;
  override filters: RoleParams = new RoleParams();
  override service: BaseCRUDHttpService<AgendaModel> = inject(AgendaService);
  override formDialog: Type<any> = AgendaFormComponent;
  override onActionClick(): void { }
  constructor() {
    super();
    this.addBreadcrub({ label: 'Session', routerLink: '/meets/session' });
  }
  ngOnInit(): void {
    this.selectedYear = new Date(2025, 0, 1);
  }
}
