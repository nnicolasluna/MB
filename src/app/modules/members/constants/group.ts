import { ColumnTableModel } from "@shared/interfaces";

export const GROUP_TABLE_COLUMNS: ColumnTableModel[] = [
    { field: 'nombre', header: 'nombre', sort: true },
    { field: 'periodo_inicio', header: 'Periodo del Grupo', sort: true },
    { field: 'periodo_fin', header: 'Periodo del Grupo', sort: true }
];
