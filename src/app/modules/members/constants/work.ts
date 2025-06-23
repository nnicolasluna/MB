import { ColumnTableModel } from "@shared/interfaces";

export const WORK_TABLE_COLUMNS: ColumnTableModel[] = [
    { field: 'nombre', header: 'Nombre de la reunion', sort: true },
    { field: 'fecha', header: 'Fecha Reunión', sort: true },
    { field: 'fecha_proximo', header: 'Próxima Reunión', sort: true }
];
