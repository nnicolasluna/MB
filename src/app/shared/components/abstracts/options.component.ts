import { Component, inject, input, OnInit, output } from '@angular/core';
import { ResourceTypes } from '@shared/constants';
import { ActionClickEvent } from '@shared/interfaces';
import { PermissionsService, ToastService } from '@shared/services';
import { ConfirmService } from '@shared/services/confirm.service';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
	template: '',
	standalone: false,
})
export abstract class BaseActionsComponent<T> implements OnInit {
	protected _ds = inject(DialogService);
	protected _ts = inject(ToastService);
	protected _cs = inject(ConfirmService);
	protected _permissions = inject(PermissionsService);

	public inline = input(false);
	public ctxMenuTemplate = input<HTMLElement>();
	public onActionClick = output<ActionClickEvent>();

	abstract resource: ResourceTypes;
	public item = input.required<T>();
	protected actions: MenuItem[] = [];

	ngOnInit(): void {
		this.buildActions();
	}

	abstract buildActions(): void;

	protected pushAction(action: MenuItem, func: (resource: ResourceTypes) => boolean): void {
		if (func(this.resource)) {
			this.actions.push(action);
		}
	}
}
