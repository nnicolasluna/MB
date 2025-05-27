import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapData, MapDataParams } from '@modules/map-data/interfaces';
import { MapDataService } from '@modules/map-data/services/map-data.service';
import { BaseListFiltersComponent, DataViewComponent, FilterBarComponent } from '@shared/components';
import { ColumnTableModel, ActionClickEvent } from '@shared/interfaces';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MapDataActionsComponent } from './components/map-data-actions/map-data-actions.component';
import { MAP_DATA_TABLE_COLUMNS } from '@modules/map-data/constants';
import { MapDataFormComponent } from './components/map-data-form/map-data-form.component';
import { ActionType } from '@shared/constants';
import { environment } from '@environments/environment';

@Component({
	selector: 'app-map-data-page',
	imports: [
		FormsModule,
		DataViewComponent,
		MapDataActionsComponent,
		FilterBarComponent,
		CardModule,
		BreadcrumbModule,
		ButtonModule,
		SelectButtonModule,
	],
	templateUrl: './map-data-page.component.html',
	styleUrl: './map-data-page.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapDataPageComponent extends BaseListFiltersComponent<MapData> {
	override tableColumns: ColumnTableModel[] = MAP_DATA_TABLE_COLUMNS;
	override filters = new MapDataParams();
	override service = inject(MapDataService);
	override formDialog?: Type<any> | undefined = MapDataFormComponent;

	public baseImageUrl = `${environment.apiHost}/${environment.apiPrefix}/static`;

	constructor() {
		super();
		this.addBreadcrub({ label: 'Gestión de datos geográficos', routerLink: ['/map-data'] });
	}

	override onActionClick({ action, data }: ActionClickEvent): void {
		if (!data?.item?.id) return;

		const { item } = data;

		switch (action) {
			case ActionType.VIEW:
				this.showDialogForm('Visualizar Cobertura', { item, isViewMode: true });
				break;
			case ActionType.EDIT:
				this.showDialogForm('Editar Cobertura', { item, isViewMode: false });
				break;
			case ActionType.DOWNLOAD:
				this.ts.info('Descargando cobertura...');
				this.service.download(item).subscribe({
					next: (url) => this.service.downloadFile(url),
					error: () => this.ts.error('Error al descargar la cobertura'),
				});
				break;
			case ActionType.DELETE:
				this.ts.info('Eliminando cobertura...');
				let sub$ = item.typeGeom == 'Raster' ? this.service.deleteRaster(item.id) : this.service.delete(item.id);

				sub$.subscribe({
					next: () => {
						this.ts.success('Cobertura eliminada con éxito');
						this.list();
					},
					error: () => this.ts.error('Error al eliminar la cobertura'),
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
