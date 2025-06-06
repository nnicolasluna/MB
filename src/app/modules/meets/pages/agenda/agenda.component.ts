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
import { SessionService } from '@modules/meets/services/session.service';
import { SessionModel } from '@modules/meets/interfaces/session.interface';
import { SessionComponent } from '../session/session.component';

@Component({
  selector: 'app-agenda',
  imports: [
    BreadcrumbModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent extends BaseListFiltersComponent<SessionModel> {
  override tableColumns: ColumnTableModel[] = ROLE_TABLE_COLUMNS;
  override filters: RoleParams = new RoleParams();
  override service: BaseCRUDHttpService<SessionModel> = inject(SessionService);
  override formDialog: Type<any> = SessionComponent;
  override onActionClick(): void { }


}
