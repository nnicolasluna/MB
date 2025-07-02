import { ColumnTableModel } from "@shared/interfaces";

export const EVENTS_TABLE_COLUMNS: ColumnTableModel[] = [
    { field: 'nombre', header: 'Tarea', sort: true },
    { field: 'grupo', header: 'Actividad', sort: true },
    { field: 'tarea', header: 'Grupo', sort: true }
];
