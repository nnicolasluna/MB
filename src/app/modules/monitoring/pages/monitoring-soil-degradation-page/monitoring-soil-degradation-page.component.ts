import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { MONITORING_WATER_TABLE_COLUMNS } from '@modules/monitoring/constants/monitoring-water';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ColumnTableModel, BaseParams, ActionClickEvent } from '@shared/interfaces';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { GuideModalComponent } from './components/guide-modal/guide-modal.component';
import { DatePipe } from '@angular/common';
import { ActionType } from '@shared/constants';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { UploadMonitoringFormComponent } from '@modules/monitoring/components/upload-monitoring-form/upload-monitoring-form.component';
import { MonitoringSoil } from '@modules/monitoring/interfaces/monitoring-soil/monitoring-soil.interface';
import { MonitoringSoilParams } from '@modules/monitoring/interfaces/monitoring-soil/monitoring-soil.params';
import { MonitoringSoilService } from '@modules/monitoring/services/monitoring-soil.service';
import { MonitoringSoilDegradationActionsComponent } from './components/monitoring-soil-degradation-actions/monitoring-soil-degradation-actions.component';

@Component({
	selector: 'app-monitoring-soil-degradation-page',
	imports: [
		DatePipe,
		FormsModule,

		MonitoringSoilDegradationActionsComponent,
		FilterBarComponent,

		BreadcrumbModule,
		TableModule,
		ButtonModule,
		SelectModule,
	],
	templateUrl: './monitoring-soil-degradation-page.component.html',
	styleUrls: ['./monitoring-soil-degradation-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringSoilDegradationPageComponent extends BaseListFiltersComponent<MonitoringSoil> {
	override tableColumns: ColumnTableModel[] = MONITORING_WATER_TABLE_COLUMNS;
	override filters: BaseParams = new MonitoringSoilParams();
	override service: MonitoringSoilService = inject(MonitoringSoilService);
	override formDialog?: Type<any> = UploadMonitoringFormComponent;
	override requiredColumns = ['leyenda'];

	constructor() {
		super();
		this.addBreadcrub({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.addBreadcrub({ label: 'Monitoreo de Degradación de Suelo', routerLink: ['/monitoring/soil-degradation'] });
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

	public onStatusChange(event: SelectChangeEvent, data: MonitoringSoil) {
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
