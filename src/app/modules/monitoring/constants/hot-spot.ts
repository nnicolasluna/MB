import { ColumnTableModel } from '@shared/interfaces';

export const HOT_SPOT_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'id', header: 'ID', sortField: 'id', sort: true },
	{ field: 'url', header: 'URL', sortField: 'url', sort: true },
	{ field: 'details', header: 'Detalles', sortField: 'details', sort: true },
	{ field: 'date', header: 'Fecha', sortField: 'date', sort: true },
	{ field: 'state', header: 'Estado', sortField: 'state', sort: true },
	{ field: 'table', header: 'Tabla', sortField: 'table', sort: true },
];
