import { ColumnTableModel } from '@shared/interfaces';

export const MONITORING_WATER_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'createdDate', header: 'Fecha de Publicación', sortField: 'createdDate', sort: true },
	{ field: 'name', header: 'Nombre', sortField: 'name', sort: true },
	{ field: 'coverageDate', header: 'Fecha de Cobertura', sortField: 'coverageDate', sort: true },
	{ field: 'user.fullName', header: 'Publicado Por', sortField: 'user.name', sort: true },
	{ field: 'coverageState', header: 'Estado', sortField: 'coverageState', sort: true },
];
