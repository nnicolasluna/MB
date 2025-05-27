import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { ResourceTypes } from '@shared/constants';
import { permissionTypes } from '@shared/interfaces';
import { CredentialsService, PermissionsService } from '@shared/services';

@Directive({
	selector: '[appPermission]',
	providers: [CredentialsService],
})
export class PermissionDirective implements OnInit {
	public resource = input<ResourceTypes>();
	public permission = input<permissionTypes>();
	public isPublic = input<boolean>(false);

	private _permissionService = inject(PermissionsService);
	private _el = inject(ElementRef);

	constructor() {}

	ngOnInit(): void {
		if (this.isPublic()) return;

		if (!this.resource() || !this.permission()) {
			return;
		}

		const permission = this._permissionService.handleAccess(this.resource()!, this.permission()!, this.isPublic());
		if (!permission) this._el.nativeElement.remove();
	}
}
