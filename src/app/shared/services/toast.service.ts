import { Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable({
	providedIn: 'root',
})
export class ToastService {
	constructor(private messageService: MessageService) {}

	public clear(): void {
		this.messageService.clear();
	}

	public success(message: string): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Correcto',
			detail: message,
		});
	}

	public error(message: string | string[]): void {
		if (Array.isArray(message)) {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: message.join(','),
			});
		} else {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: message,
			});
		}
	}

	public info(message: string, opts?: ToastMessageOptions): void {
		this.messageService.add({
			severity: 'info',
			summary: 'Informacion',
			detail: message,
			...opts,
		});
	}

	public warn(message: string): void {
		this.messageService.add({
			severity: 'warn',
			summary: 'Advertencia',
			detail: message,
		});
	}
}
