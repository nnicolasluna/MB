import { ChangeDetectorRef, Component, inject, OnDestroy, signal, Type } from '@angular/core';
import { ActionClickEvent, BaseParams, ColumnTableModel, ListResponse } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services/base-crud-http.service';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '@shared/services';
import { Observable } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
	template: '',
	standalone: false,
})
export abstract class BaseListFiltersComponent<T> implements OnDestroy {
	public breadCrumbs: MenuItem[] = [{ icon: 'pi pi-home', routerLink: '/' }];
	public isLoading = signal(false);
	public items = signal<T[]>([]);
	public totalRecords = signal<number>(0);

	public rowsPerPageOptions = [6, 12, 24];

	protected ds = inject(DialogService);
	protected ts = inject(ToastService);

	abstract tableColumns: ColumnTableModel[];
	abstract filters: BaseParams;
	abstract service: BaseCRUDHttpService<T> | { getAll: (params: BaseParams) => Observable<ListResponse<T>> };

	abstract formDialog?: Type<any>;
	protected modalConfig: DynamicDialogConfig = {
		header: 'Agregar',
		modal: true,
		closable: true,
		maximizable: true,
		contentStyle: { overflow: 'auto' },
		width: '65vw',
		breakpoints: {
			'960px': '75vw',
			'640px': '90vw',
		},
	};
	protected formDialogRef?: DynamicDialogRef;

	public onLazyLoad(event: TableLazyLoadEvent) {
		this.filters.defineFromDataViewLazyLoadEvent(event);

		this.list();
	}

	protected onDestroy(): void { }

	ngOnDestroy(): void {
		this.onDestroy();
		this.formDialogRef?.close();
	}

	protected list() {
		this.isLoading.set(true);

		this.service.getAll(this.filters).subscribe({
			next: (items) => {
				this.items.set([...items.items]);
				this.totalRecords.set(items.total);
				this.isLoading.set(false);
			},
			error: () => {
				this.isLoading.set(false);
				this.totalRecords.set(0);
				this.items.set([]);
				this.ts.error('Error al cargar los registros');
			},
		});
	}

	protected listWithReset() {
		this.list();
	}

	protected onReload() {
		this.list();
	}

	cdr = inject(ChangeDetectorRef);

	protected requiredColumns: string[] = [];

	protected showDialogForm(header: string, data?: any, dialog = this.formDialog) {
		console.log(header)
		if (!dialog) return;
		this.modalConfig.data = data ?? {};
		this.modalConfig.data.columns = this.requiredColumns;
		this.modalConfig.data.service = this.service;
		this.modalConfig.header = header;
		this.formDialogRef = this.ds.open(dialog, this.modalConfig);
		this.formDialogRef.onClose.subscribe((data) => {
			if (data) this.list();
			this.formDialogRef?.destroy();
			this.cdr.detectChanges();
		});
	}

	protected onSearch(search: string) {
		this.filters.search = search;
		this.list();
	}

	protected addBreadcrub(item: MenuItem) {
		this.breadCrumbs.push(item);
	}

	abstract onActionClick({ action, data }: ActionClickEvent): void;
}
