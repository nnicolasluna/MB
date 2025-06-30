import { ColumnTableModel } from "@shared/interfaces";

export const EVENTS_TABLE_COLUMNS: ColumnTableModel[] = [
    { field: 'nombre', header: 'Actividad', sort: true },
    { field: 'grupo', header: 'Tipo de Sesión', sort: true },
    { field: 'tarea', header: 'Grupo', sort: true }
];
