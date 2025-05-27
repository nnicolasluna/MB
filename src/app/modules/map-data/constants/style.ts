import { ColumnTableModel } from '@shared/interfaces';
import { SelectItem } from 'primeng/api';

export const STYLE_TABLE_COLUMNS: ColumnTableModel[] = [{ field: 'name', header: 'Nombre' }];

export const STYLE_SORT_OPTIONS: SelectItem[] = [{ label: 'Nombre', value: 'name' }];
