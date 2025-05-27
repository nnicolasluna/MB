import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { MonitoringWater } from '@modules/monitoring/interfaces/monitoring-water/monitoring-water.interface';
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
import { MonitoringBurnActionsComponent } from './components/monitoring-burn-actions/monitoring-burn-actions.component';
import { MonitoringBurn } from '@modules/monitoring/interfaces/monitoring-burn/monitoring-burn.interface';
import { MONITORING_BURN_TABLE_COLUMNS } from '@modules/monitoring/constants/monitoring-burn';
import { MonitoringBurnParams } from '@modules/monitoring/interfaces/monitoring-burn/monitoring-burn.params';
import { MonitoringBurnService } from '@modules/monitoring/services/monitoring-burn.service';

@Component({
	selector: 'app-monitoring-burn-page',
	imports: [
		DatePipe,
		FormsModule,
		MonitoringBurnActionsComponent,
		FilterBarComponent,
		BreadcrumbModule,
		TableModule,
		ButtonModule,
		SelectModule,
	],
	templateUrl: './monitoring-burn-page.component.html',
	styleUrls: ['./monitoring-burn-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringBurnPageComponent extends BaseListFiltersComponent<MonitoringBurn> {
	override tableColumns: ColumnTableModel[] = MONITORING_BURN_TABLE_COLUMNS;
	override filters: BaseParams = new MonitoringBurnParams();
	override service: MonitoringBurnService = inject(MonitoringBurnService);
	override formDialog?: Type<any> = UploadMonitoringFormComponent;
	override requiredColumns = ['leyenda'];

	constructor() {
		super();
		this.addBreadcrub({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.addBreadcrub({ label: 'Monitoreo de Fuego', routerLink: ['/monitoring/fire'] });
		this.addBreadcrub({ label: 'Quemas Detectadas', routerLink: ['/monitoring/fire/burn'] });
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
