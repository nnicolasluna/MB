import { HttpParams } from '@angular/common/http';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { TableLazyLoadEvent } from 'primeng/table';

export abstract class BaseParams {
	public limit?: number = 6;
	public setLimit(limit: number) {
		this.limit = limit;
		return this;
	}

	public skip?: number = 0;
	public setSkip(skip: number) {
		this.skip = skip;
		return this;
	}

	public sortField?: string = 'id';
	public setSortField(sortField: string) {
		this.sortField = sortField;
		return this;
	}

	public sortDir?: string = 'desc';
	public setSortDir(sortDir: string) {
		this.sortDir = sortDir;
		return this;
	}

	public showAll: boolean = false;
	public setShowAll(showAll: boolean) {
		this.showAll = showAll;
		return this;
	}

	public search: string = '';
	public setSearch(search: string) {
		this.search = search;
		return this;
	}

	public defineFromTableLazyLoadEvent(params: TableLazyLoadEvent) {
		this.limit = params.rows ?? 6;
		this.skip = params.first ?? 0;
		this.showAll = false;
		if (params.globalFilter) this.search = params.globalFilter as string;
		if (params.sortField) {
			this.sortField = params.sortField as any;
			this.sortDir = params.sortOrder === 1 ? 'desc' : 'asc';
		}
		return this;
	}

	public defineFromDataViewLazyLoadEvent(params: DataViewLazyLoadEvent | TableLazyLoadEvent) {
		this.limit = params.rows ?? 6;
		this.skip = params.first ?? 0;
		this.showAll = false;
		if (params.sortField) {
			this.sortField = params.sortField as any;
			this.sortDir = params.sortOrder === 1 ? 'desc' : 'asc';
		}
		return this;
	}

	public toHttpParams(): HttpParams {
		return new HttpParams({
			fromObject: this as any,
		});
	}
}
