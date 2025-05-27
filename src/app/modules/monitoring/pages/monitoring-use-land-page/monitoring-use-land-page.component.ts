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
import { MonitoringUse } from '@modules/monitoring/interfaces/monitoring-use/monitoring-use.interface';
import { MonitoringUseService } from '@modules/monitoring/services/monitoring-use.service';
import { MonitoringUseParams } from '@modules/monitoring/interfaces/monitoring-use/monitoring-use.params';
import { MonitoringUseLandActionsComponent } from './components/monitoring-use-land-actions/monitoring-use-land-actions.component';

@Component({
	selector: 'app-monitoring-use-land-page',
	imports: [
		DatePipe,
		FormsModule,

		MonitoringUseLandActionsComponent,
		FilterBarComponent,

		BreadcrumbModule,
		TableModule,
		ButtonModule,
		SelectModule,
	],
	templateUrl: './monitoring-use-land-page.component.html',
	styleUrls: ['./monitoring-use-land-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringUseLandPageComponent extends BaseListFiltersComponent<MonitoringUse> {
	override tableColumns: ColumnTableModel[] = MONITORING_WATER_TABLE_COLUMNS;
	override filters: BaseParams = new MonitoringUseParams();
	override service: MonitoringUseService = inject(MonitoringUseService);
	override formDialog?: Type<any> = UploadMonitoringFormComponent;
	override requiredColumns = ['leyenda'];

	constructor() {
		super();
		this.addBreadcrub({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.addBreadcrub({ label: 'Monitoreo de Uso de suelo', routerLink: ['/monitoring/soil'] });
		this.addBreadcrub({ label: 'Uso de suelo', routerLink: ['/monitoring/use-land'] });
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

	public onStatusChange(event: SelectChangeEvent, data: MonitoringUse) {
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
