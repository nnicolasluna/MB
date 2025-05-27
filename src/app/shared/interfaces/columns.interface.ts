export interface ColumnTableModel {
	field: string;
	header: string;
	transform?: (value: any) => string;
	defaultValue?: string;
	sort?: boolean;
	sortField?: string;
}
