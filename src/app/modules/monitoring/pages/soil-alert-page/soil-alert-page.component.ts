import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { MonitoringWater } from '@modules/monitoring/interfaces/monitoring-water/monitoring-water.interface';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ColumnTableModel, BaseParams, ActionClickEvent } from '@shared/interfaces';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { ActionType } from '@shared/constants';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { UploadMonitoringFormComponent } from '@modules/monitoring/components/upload-monitoring-form/upload-monitoring-form.component';
import { BurnHistoricActionsComponent } from './components/burn-historic-actions/burn-historic-actions.component';
import { BURN_HISTORIC_TABLE_COLUMNS } from '@modules/monitoring/constants/burn-historic';
import { SoilAlert } from '@modules/monitoring/interfaces/soil-alert/soil-alert.interface';
import { SoilAlertParams } from '@modules/monitoring/interfaces/soil-alert/soil-alert.params';
import { SoilAlertService } from '@modules/monitoring/services/soil-alert.service';

@Component({
	selector: 'app-soil-alert-page',
	imports: [
		DatePipe,
		FormsModule,
		BurnHistoricActionsComponent,
		FilterBarComponent,
		BreadcrumbModule,
		TableModule,
		ButtonModule,
		SelectModule,
	],
	templateUrl: './soil-alert-page.component.html',
	styleUrls: ['./soil-alert-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoilAlertPageComponent extends BaseListFiltersComponent<SoilAlert> {
	override tableColumns: ColumnTableModel[] = BURN_HISTORIC_TABLE_COLUMNS;
	override filters: BaseParams = new SoilAlertParams();
	override service: SoilAlertService = inject(SoilAlertService);
	override formDialog?: Type<any> = UploadMonitoringFormComponent;
	override requiredColumns = ['sup_ha', 'prov', 'mun', 'aps', 'tcos', 'ramsar'];

	constructor() {
		super();
		this.addBreadcrub({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.addBreadcrub({ label: 'Monitoreo de Uso de Suelo', routerLink: ['/monitoring/soil'] });
		this.addBreadcrub({ label: 'Alertas de Suelo', routerLink: ['/monitoring/soil/alerts'] });
	}

	override onActionClick({ action, data }: ActionClickEvent): void {
		if (!data?.item?.id) return;
		const { item } = data;

		switch (action) {
			case ActionType.VIEW:
				this.showDialogForm('GeoProcesamiento', { item, isViewMode: true });
				break;

			case ActionType.EDIT:
				this.showDialogForm('GeoProcesamiento', { item });
				break;

			case ActionType.DOWNLOAD:
				this.ts.info('Descargando cobertura...');
				this.service.download(item).subscribe({
					next: (url) => this.service.downloadFile(url),
					error: () => this.ts.error('Error al descargar la cobertura'),
				});
				break;
			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
					next: () => {
						this.ts.success('Monitoreo eliminado con éxito');
						this.list();
					},
					error: () => this.ts.error('Error al eliminar el monitoreo'),
				});
				break;
		}
	}

	public statusOptions = ['Activo', 'Inactivo'];

	public onStatusChange(event: SelectChangeEvent, data: MonitoringWater) {
		const prev = data.coverageState;
		data.coverageState = event.value;
		this.service.updateStatus(data).subscribe({
			next: () => {
				this.ts.success('Estado actualizado');
				this.onReload();
			},
			error: () => {
				data.coverageState = prev;
				this.ts.error('Error al actualizar el estado');
			},
		});
	}
}
