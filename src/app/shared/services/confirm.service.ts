import { inject, Injectable } from '@angular/core';
import { Confirmation, ConfirmationService } from 'primeng/api';

@Injectable({
	providedIn: 'root',
})
export class ConfirmService {
	private _cs = inject(ConfirmationService);

	public confirmDelete(data: Confirmation) {
		this._cs.confirm({
			header: data.header || 'Eliminar',
			message: data.message || '¿Está seguro de que desea eliminar este registro?',
			icon: 'pi pi-exclamation-triangle text-red-600',
			defaultFocus: 'none',
			rejectButtonProps: {
				severity: 'secondary',
				outlined: true,
				autoFocus: false,
			},
			acceptButtonProps: {
				severity: 'danger',
				autoFocus: false,
			},
			...data,
		});
	}
}
