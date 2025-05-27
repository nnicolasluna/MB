import { ColumnTableModel } from '@shared/interfaces';

export const USER_TABLE_COLUMNS: ColumnTableModel[] = [
	{ field: 'fullName', sortField: 'name', header: 'Nombre', sort: true },
	{ field: 'email', header: 'Correo', sort: true },
	{ field: 'address', header: 'Dirección', sort: true },
	{ field: 'ci', header: 'CI', sort: true },
	{ field: 'role.name', header: 'Rol', defaultValue: 'Sin Rol', sort: true },
	{ field: 'reviwedVerificationCode', header: 'Cuenta Activa', sort: true },
];

export const enum UserStatus {
	APROVE = 'APROVE',
	PENDING = 'PENDING',
	REJECT = 'REJECT',
	DISABLED = 'DISABLED',
}
