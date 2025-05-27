import { ColumnTableModel } from '@shared/interfaces';
import { SelectItem } from 'primeng/api';

export const PERMISSION_SORT_OPTIONS: SelectItem[] = [
	{ label: 'Fecha de creación', value: 'createdDate' },
	{ label: 'Rol', value: 'role.name' },
	{ label: 'Recurso', value: 'resource.name' },
];

export const PERMISSION_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'role.name', header: 'Rol', sort: true },
	{ field: 'resource.name', header: 'Recurso', sort: true },
	{ field: 'permission', header: 'Permisos', sort: false },
];
