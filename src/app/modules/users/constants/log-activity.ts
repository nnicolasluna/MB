import { ColumnTableModel } from '@shared/interfaces';
import dayjs from 'dayjs';
import { SelectItem } from 'primeng/api';

export const ACTIVITY_SORT_OPTIONS: SelectItem[] = [
	{ label: 'Fecha', value: 'date' },
	{ label: 'Nombre de usuario', value: 'user.username' },
	{ label: 'Apellido paterno', value: 'user.firstSurname' },
	{ label: 'Primer nombre', value: 'user.firstName' },
];

export const ACTIVITY_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'description', header: 'Descripción' },
	{ field: 'method', header: 'Método' },
	{ field: 'url', header: 'Dirección url' },
	{ field: 'ip', header: 'IP' },
	{ field: 'user.username', header: 'Usuario' },
	{ field: 'user.fullName', header: 'Nombre' },
	{ field: 'date', header: 'Fecha', transform: (value: any) => dayjs(value).format('DD/MM/YYYY') },
];
