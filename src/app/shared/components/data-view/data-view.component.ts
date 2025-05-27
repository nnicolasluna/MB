import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Injector,
	input,
	model,
	output,
	TemplateRef,
	viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataView, DataViewLazyLoadEvent, DataViewModule } from 'primeng/dataview';
import { TooltipModule } from 'primeng/tooltip';
import { getNestedValue } from '@shared/utils';
import { ColumnTableModel } from '@shared/interfaces';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-data-view',
    imports: [LoaderComponent, DataViewModule, ButtonModule, TooltipModule, NgTemplateOutlet],
    templateUrl: './data-view.component.html',
    styleUrl: './data-view.component.scss',
    changeDetection: ChangeDetectionStrategy.Default
})
export class DataViewComponent {
	public injector = inject(Injector);

	public lazy = input(true);
	public paginator = input(true);
	public alwaysShowPaginator = input(true);
	public rowsPerPageOptions = input<number[]>([6, 12, 24]);
	public sortField = input<string>('id');
	public sortDir = input<boolean>(true);

	public isLoading = input(false);

	public layout = model<'list' | 'grid'>('grid');

	public items = input.required<any>();
	public totalRecords = input<number>(0);

	public onLazyLoad = output<DataViewLazyLoadEvent>();

	public tableStyles = input<string>('');

	public actionsTemplate = input<TemplateRef<any>>();
	public gridItemTemplate = input.required<TemplateRef<any>>();
	public listItemTemplate = input<TemplateRef<any>>();
	public showActions = input(true);
	public showTableHeader = input(true);
	public tableColumns = input.required<ColumnTableModel[]>();

	public getPropValue(obj: any, column: ColumnTableModel): any {
		if (column.transform) {
			const res = getNestedValue(obj, column.field);
			if (res === null || res === undefined) {
				return column.defaultValue;
			}
			return column.transform(res);
		}

		return getNestedValue(obj, column.field, column.defaultValue);
	}

	private dt = viewChild<DataView>('dt');

	public resetPaginator(): number {
		this.dt()?.paginate({ first: 0, rows: this.dt()?.rows ?? 0 });
		return this.dt()?.rows ?? 0;
	}

	public emitLazyLoad(event: DataViewLazyLoadEvent): void {
		this.onLazyLoad.emit(event);
	}
}
