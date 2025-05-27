import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterBarComponent, BaseListFiltersComponent } from '@shared/components';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StylesActionsComponent } from './components/styles-actions/styles-actions.component';
import { Style } from '@modules/map-data/interfaces/style/style.interface';
import { ColumnTableModel, ActionClickEvent } from '@shared/interfaces';
import { StyleParams } from '@modules/map-data/interfaces/style/style.params';
import { StylesFormComponent } from './components/styles-form/styles-form.component';
import { StyleService } from '@modules/map-data/services/style.service';
import { ActionType } from '@shared/constants';
import { STYLE_TABLE_COLUMNS } from '@modules/map-data/constants/style';
import { TableModule } from 'primeng/table';

@Component({
	selector: 'app-styles-page',
	imports: [
		FormsModule,
		StylesActionsComponent,
		TableModule,
		FilterBarComponent,
		CardModule,
		BreadcrumbModule,
		ButtonModule,
		SelectButtonModule,
	],
	templateUrl: './styles-page.component.html',
	styleUrl: './styles-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylesPageComponent extends BaseListFiltersComponent<Style> {
	override tableColumns: ColumnTableModel[] = STYLE_TABLE_COLUMNS;
	override filters = new StyleParams();
	override service = inject(StyleService);
	override formDialog?: Type<any> | undefined = StylesFormComponent;

	constructor() {
		super();
		this.addBreadcrub({ label: 'Gestión de estilos', routerLink: ['/styles'] });
	}

	override onActionClick({ action, data }: ActionClickEvent): void {
		if (!data?.item?.id) return;

		const { item } = data;

		switch (action) {
			case ActionType.VIEW:
				this.showDialogForm('Visualizar Estilo', { item, isViewMode: true });
				break;
			case ActionType.EDIT:
				this.showDialogForm('Editar Estilo', { item, isViewMode: false });
				break;
			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
					next: () => {
						this.ts.success('Estilo eliminado con éxito');
						this.list();
					},
					error: () => this.ts.error('Error al eliminar el estilo'),
				});
				break;
		}
	}

	override showDialogForm(header: string, data?: any) {
		if (!this.formDialog) return;
		this.modalConfig.data = data;
		this.modalConfig.header = header;
		this.formDialogRef = this.ds.open(this.formDialog, this.modalConfig);
		this.formDialogRef.onClose.subscribe((data) => {
			if (data) window.location.reload();
			this.formDialogRef?.destroy();
			this.cdr.detectChanges();
		});
	}
}
