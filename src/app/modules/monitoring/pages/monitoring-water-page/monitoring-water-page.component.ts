import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { MONITORING_WATER_TABLE_COLUMNS } from '@modules/monitoring/constants/monitoring-water';
import { MonitoringWater } from '@modules/monitoring/interfaces/monitoring-water/monitoring-water.interface';
import { MonitoringWaterParams } from '@modules/monitoring/interfaces/monitoring-water/monitoring-water.params';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ColumnTableModel, BaseParams, ActionClickEvent } from '@shared/interfaces';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { GuideModalComponent } from './components/guide-modal/guide-modal.component';
import { MonitoringWaterActionsComponent } from './components/monitoring-water-actions/monitoring-water-actions.component';
import { DatePipe } from '@angular/common';
import { MonitoringWaterService } from '@modules/monitoring/services/monitoring-water.service';
import { ActionType } from '@shared/constants';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { UploadMonitoringFormComponent } from '@modules/monitoring/components/upload-monitoring-form/upload-monitoring-form.component';

@Component({
	selector: 'app-monitoring-water-page',
	imports: [
		DatePipe,
		FormsModule,

		MonitoringWaterActionsComponent,
		FilterBarComponent,

		BreadcrumbModule,
		TableModule,
		ButtonModule,
		SelectModule,
	],
	templateUrl: './monitoring-water-page.component.html',
	styleUrls: ['./monitoring-water-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringWaterPageComponent extends BaseListFiltersComponent<MonitoringWater> {
	override tableColumns: ColumnTableModel[] = MONITORING_WATER_TABLE_COLUMNS;
	override filters: BaseParams = new MonitoringWaterParams();
	override service: MonitoringWaterService = inject(MonitoringWaterService);
	override formDialog?: Type<any> = UploadMonitoringFormComponent;
	override requiredColumns = ['label', 'leyenda', 'fecha'];

	constructor() {
		super();
		this.addBreadcrub({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.addBreadcrub({ label: 'Monitoreo de Cuerpos de Agua', routerLink: ['/monitoring/water'] });
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

	public onShowGuide() {
		this.showDialogForm('Guía de acceso a Script', null, GuideModalComponent);
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
