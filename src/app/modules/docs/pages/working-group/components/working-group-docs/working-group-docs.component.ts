import { Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WORKING_TABLE_COLUMNS } from '@modules/docs/constants/working';
import { OfficialCreateFormComponent } from '@modules/docs/pages/official/components/official-create-form/official-create-form.component';
import { GroupService } from '@modules/members/services/group.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { WorkingGroupDocsFormComponent } from '../working-group-docs-form/working-group-docs-form.component';
import { WorkingDocsService } from '@modules/docs/services/workingDocs.service';

@Component({
  selector: 'app-working-group-docs',
  imports: [
    FormsModule,
    TableModule,
    BreadcrumbModule,
    CheckboxModule,
    ButtonModule,
    SelectButtonModule,
    CardModule,
  ],
  templateUrl: './working-group-docs.component.html',
  styleUrl: './working-group-docs.component.scss'
})
export class WorkingGroupDocsComponent extends BaseListFiltersComponent<any> {
  override tableColumns: ColumnTableModel[] = WORKING_TABLE_COLUMNS;
  override filters: RoleParams = new RoleParams();
  override service: BaseCRUDHttpService<any> = inject(WorkingDocsService);
  override formDialog: Type<any> = WorkingGroupDocsFormComponent;
  constructor() {
    super();
    this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
    this.addBreadcrub({ label: 'Documentos por Grupo de Trabajo', routerLink: '/docs/workingGroup' });
    this.addBreadcrub({ label: 'Documentos por Grupo de Trabajo', routerLink: '/docs/workingGroup' });
  }
  override onActionClick({ data, action }: ActionClickEvent) { }
}
