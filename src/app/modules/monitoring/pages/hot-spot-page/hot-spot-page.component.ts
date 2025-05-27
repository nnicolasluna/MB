import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { HOT_SPOT_TABLE_COLUMNS } from '@modules/monitoring/constants/hot-spot';
import { HotSpot } from '@modules/monitoring/interfaces/hot-spot/hot-spot.interface';
import { HotSpotParams } from '@modules/monitoring/interfaces/hot-spot/hot-spot.params';
import { HotSpotService } from '@modules/monitoring/services/hot-spot.service';
import { BaseListFiltersComponent, FilterBarComponent } from '@shared/components';
import { ColumnTableModel, BaseParams, ActionClickEvent } from '@shared/interfaces';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
	selector: 'app-hot-spot-page',
	imports: [FilterBarComponent, TableModule, DatePipe, BreadcrumbModule, ButtonModule],
	templateUrl: './hot-spot-page.component.html',
	styleUrls: ['./hot-spot-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotSpotPageComponent extends BaseListFiltersComponent<HotSpot> {
	override tableColumns: ColumnTableModel[] = HOT_SPOT_TABLE_COLUMNS;
	override filters: BaseParams = new HotSpotParams();
	override service: HotSpotService = inject(HotSpotService);
	override formDialog?: Type<any> | undefined;
	override onActionClick({}: ActionClickEvent): void {
		throw new Error('Method not implemented.');
	}

	constructor() {
		super();
		this.addBreadcrub({ label: 'Monitoreo', routerLink: ['/monitoring'] });
		this.addBreadcrub({ label: 'Monitoreo de Fuego', routerLink: ['/monitoring/fire'] });
		this.addBreadcrub({ label: 'Focos de calor', routerLink: ['/monitoring/hot-spot'] });
	}
}
