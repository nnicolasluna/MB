import { ChangeDetectionStrategy, Component, inject, model, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { USER_TABLE_COLUMNS, UserStatus } from '@modules/users/constants';
import { UserModel } from '@modules/users/interfaces';
import { UserParams } from '@modules/users/interfaces/users/user.params';
import { UserService } from '@modules/users/services/user.service';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsModule } from 'primeng/tabs';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { UserActionsComponent } from './components/user-actions/user-actions.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { Observable } from 'rxjs';
import { ActionType } from '@shared/constants';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { AttachmentService } from '@shared/services/attachment.service';

@Component({
	selector: 'app-user-list',
	imports: [
		UserActionsComponent,
		TableModule,
		FilterBarComponent,
		BreadcrumbModule,
		ButtonModule,
		SelectButtonModule,
		FormsModule,
		TabsModule,
		DataViewModule,
		CardModule,
		CheckboxModule,
		MenuModule,
		InputTextModule,
		ImageModule,
		ToggleButtonModule,
		ToolbarModule,
		SelectModule,
	],
	templateUrl: './user-page.component.html',
	styleUrl: './user-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent extends BaseListFiltersComponent<UserModel> {
	override formDialog: Type<any> = UserFormComponent;
	override tableColumns: ColumnTableModel[] = USER_TABLE_COLUMNS;
	override filters: UserParams = new UserParams();
	override service = inject(UserService);

	public attachmentService = inject(AttachmentService);

	index = model(0);

	constructor() {
		super();
		this.addBreadcrub({ label: 'Usuarios', routerLink: '/users' });
	}

	public onChangeTabs(index: string | number) {
		switch (index) {
			case 0:
				this.filters.userStatus = UserStatus.APROVE;
				break;
			case 1:
				this.filters.userStatus = UserStatus.PENDING;
				break;
			case 2:
				this.filters.userStatus = UserStatus.REJECT;
				break;
			case 3:
				this.filters.userStatus = UserStatus.DISABLED;
				break;
		}

		this.listWithReset();
	}

	override onActionClick({ data, action }: ActionClickEvent) {
		if (!data?.item?.id) return;
		const { item } = data;

		switch (action) {
			case ActionType.VIEW:
				this.showDialogForm('Visualizar Usuario', { item, isViewMode: true });
				break;

			case ActionType.EDIT:
				this.showDialogForm('Editar Usuario', { item });
				break;

			case ActionType.DISABLE:
				this.handleServiceResponse(
					this.service.updateStatus(item.id, UserStatus.DISABLED),
					'Usuario deshabilitado correctamente',
					'Error al deshabilitar el usuario',
				);
				break;

			case ActionType.APPROVE:
				this.handleServiceResponse(
					this.service.updateStatus(item.id, UserStatus.APROVE),
					'Usuario aprobado correctamente',
					'Error al aprobar el usuario',
				);
				break;

			case ActionType.SEND_EMAIL:
				this.ts.info('Enviando correo...');
				this.handleServiceResponse(
					this.service.updateStatus(item.id, UserStatus.APROVE),
					'Correo enviado correctamente',
					'Error al enviar el correo',
				);
				break;

			case ActionType.REJECT:
				this.handleServiceResponse(
					this.service.updateStatus(item.id, UserStatus.REJECT),
					'Usuario rechazado correctamente',
					'Error al rechazar el usuario',
				);
				break;

			case ActionType.ENABLE:
				this.handleServiceResponse(
					this.service.updateStatus(item.id, UserStatus.PENDING),
					'Usuario habilitado correctamente',
					'Error al habilitar el usuario',
				);
				break;

			case ActionType.DELETE:
				this.handleServiceResponse(
					this.service.delete(item.id),
					'Usuario eliminado correctamente',
					'Error al eliminar el usuario',
				);
				break;
		}
	}

	private handleServiceResponse(observable: Observable<any>, successMessage: string, errorMessage: string) {
		observable.subscribe({
			next: () => {
				this.ts.success(successMessage);
				this.list();
			},
			error: () => {
				this.ts.error(errorMessage);
			},
		});
	}
}
