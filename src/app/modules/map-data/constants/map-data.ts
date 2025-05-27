import { ColumnTableModel } from '@shared/interfaces';
import dayjs from 'dayjs';
import { SelectItem } from 'primeng/api';

export const MAP_DATA_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'name', header: 'Nombre' },
	{ field: 'description', header: 'Descripción' },
	{ field: 'contactResource', header: 'Contacto' },
	{ field: 'contentDate', header: 'Fecha de contenido', transform: (value: any) => dayjs(value).format('DD/MM/YYYY') },
	{ field: 'style.name', header: 'SLD' },
];

export const MAP_DATA_SORT_OPTIONS: SelectItem[] = [
	{ label: 'ID', value: 'id' },
	{ label: 'Nombre', value: 'name' },
	{ label: 'Fecha de contenido', value: 'contentDate' },
];

export const enum MapUploadStatus {
	PENDING = 'PENDING',
	DECOMPRESSION = 'DECOMPRESSION',
	PROCESSING = 'PROCESSING',
	UPLOADING = 'UPLOADING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
}

export const uploadMessages: Record<MapUploadStatus, string> = {
	[MapUploadStatus.PENDING]: '',
	[MapUploadStatus.DECOMPRESSION]: 'Descomprimiendo mapa...',
	[MapUploadStatus.PROCESSING]: 'Procesando mapa...',
	[MapUploadStatus.UPLOADING]: 'Cargando mapa...',
	[MapUploadStatus.COMPLETED]: 'Carga completada',
	[MapUploadStatus.FAILED]: 'Carga fallida',
};
