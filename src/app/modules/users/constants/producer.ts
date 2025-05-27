import { ColumnTableModel } from '@shared/interfaces';
import { SelectItem } from 'primeng/api';

export const PRODUCER_SORT_OPTIONS: SelectItem[] = [
	{ label: 'ID', value: 'id' },
	{ label: 'CI', value: 'ci' },
	{ label: 'Nombre', value: 'names' },
	{ label: 'Apellido Paterno', value: 'firstSurname' },
];

export const PRODUCER_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'name', header: 'Nombres' },
	{ field: 'firstSurname', header: 'Apellido Paterno' },
	{ field: 'secondSurname', header: 'Apellido Materno' },
	{ field: 'ci', header: 'CI' },
	{ field: 'phone', header: 'Teléfono' },
];
