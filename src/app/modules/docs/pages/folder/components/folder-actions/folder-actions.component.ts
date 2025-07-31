import { Component } from '@angular/core';
import { ActionsMenuComponent, BaseActionsComponent } from '@shared/components';
import { ActionType, ResourceTypes } from '@shared/constants';

@Component({
  selector: 'app-folder-actions',
  imports: [ActionsMenuComponent],
  templateUrl: './folder-actions.component.html',
  styleUrl: './folder-actions.component.scss'
})
export class FolderActionsComponent extends BaseActionsComponent<any> {
  override resource: ResourceTypes = ResourceTypes.ROLES;
  override buildActions(): void {
    this.pushAction(
      {
        label: 'Documentos',
        icon: 'pi pi-folder-open',
        styleClass: 'text-blue-600',
        command: () => {
          this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.NEXT });
        },
      },
      this._permissions.canView.bind(this._permissions)
    );
    this.pushAction(
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        styleClass: 'text-blue-600',
        command: () => {
          this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.VIEW });
        },
      },
      this._permissions.canView.bind(this._permissions)
    );

    this.pushAction(
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        styleClass: 'text-green-600',
        command: () => {
          this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.EDIT });
        },
      },
      this._permissions.canUpdate.bind(this._permissions)
    );
    this.pushAction(
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600',
        command: () => {
          this._cs.confirmDelete({
            accept: () => {
              this.onActionClick.emit({ data: { item: this.item() }, action: ActionType.DELETE });
            },
          });
        },
      },
      this._permissions.canDelete.bind(this._permissions)
    );
  }
}
