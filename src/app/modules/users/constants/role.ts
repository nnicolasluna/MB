import { ColumnTableModel } from '@shared/interfaces';
import { SelectItem } from 'primeng/api';

export const ROLE_SORT_OPTIONS: SelectItem[] = [
	{ label: 'ID', value: 'id' },
	{ label: 'Nombre', value: 'name' },
];

export const ROLE_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'name', header: 'Nombre', sort: true },
	{ field: 'description', header: 'Descripción', sort: true },
];
