import { Component, inject, Type } from '@angular/core';
import { folderService } from '@modules/docs/services/folder.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { FOLDER_TABLE_COLUMNS } from '@modules/docs/constants/folder';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderActionsComponent } from './components/folder-actions/folder-actions.component';
import { FolderFormComponent } from './components/folder-form/folder-form.component';
import { ActionType } from '@shared/constants';

@Component({
  selector: 'app-folder',
  imports: [
    FormsModule,
    TableModule,
    BreadcrumbModule,
    CheckboxModule,
    ButtonModule,
    SelectButtonModule,
    CardModule,
    FolderActionsComponent,
    TooltipModule,
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent extends BaseListFiltersComponent<any> {
  override tableColumns: ColumnTableModel[] = FOLDER_TABLE_COLUMNS;
  override filters: RoleParams = new RoleParams();
  override service: BaseCRUDHttpService<any> = inject(folderService);
  override formDialog: Type<any> = FolderFormComponent;
  id_group: any;
  title: any;
  constructor(private router: Router, private route: ActivatedRoute) {
    super();
    this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
    this.addBreadcrub({ label: 'Documentos por Grupo de Trabajo', routerLink: '/docs/workingGroup' });
    /* this.addBreadcrub({ label: 'Carpetas', routerLink: '' }); */
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id_group = params.get('id');
      this.title = params.get('name');
      this.addBreadcrub({ label: this.title, routerLink: '' });
    });
  }
  override onActionClick({ data, action }: ActionClickEvent) {
    if (!data?.item?.id) return;
    const { item } = data;
    switch (action) {
      case ActionType.VIEW:
        this.showDialogForm('Visualizar', { item, isViewMode: true });
        break;
      case ActionType.EDIT:
        this.showDialogForm('Editar', { item });
        break;
      case ActionType.NEXT:
        console.log(item)
        this.router.navigate(['docs/working-group-docs', item.nombre, item.id]);
        break;
      case ActionType.DELETE:
        this.service.delete(item.id).subscribe({
          next: () => {
            this.ts.success('Eliminado correctamente');
            this.list();
          },
          error: () => {
            this.ts.error('Error al eliminar');
          },
        });
        break;
    }
  }
  override list() {
    this.isLoading.set(true);

    this.service.getByIdPaginate(this.id_group, this.filters).subscribe({
      next: (items) => {
        this.items.set([...items.items]);
        this.totalRecords.set(items.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.totalRecords.set(0);
        this.items.set([]);
        this.ts.error('Error al cargar los registros');
      },
    });
  }
  agregarFolderbyGroup(nombre: string, id: number) {
		this.router.navigate(['docs/working-group-docs', nombre, id]);
	}
}
