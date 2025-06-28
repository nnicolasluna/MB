import { ColumnTableModel } from "@shared/interfaces";

export const EVENTS_TABLE_COLUMNS: ColumnTableModel[] = [
    { field: 'nombre', header: 'Fecha', sort: true },
    { field: 'grupo', header: 'Grupo', sort: true },
    { field: 'tarea', header: 'Tarea', sort: true }
];
