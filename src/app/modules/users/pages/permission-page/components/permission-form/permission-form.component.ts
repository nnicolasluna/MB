import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Permission, Resource, RoleParams } from '@modules/users/interfaces';
import { PermissionService } from '@modules/users/services/permission.service';
import { RoleService } from '@modules/users/services/role.service';
import { InputErrorComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { PermissionsService } from '@shared/services';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { catchError, map } from 'rxjs';

@Component({
	selector: 'app-permission-form',
	imports: [ReactiveFormsModule, InputErrorComponent, ButtonModule, SelectModule, CheckboxModule],
	templateUrl: './permission-form.component.html',
	styleUrl: './permission-form.component.scss',
})
export class PermissionFormComponent extends BaseFormComponent<Permission> {
	override _service = inject(PermissionService);

	private _permissionsService = inject(PermissionsService);

	private _roleService = inject(RoleService);
	public roles = toSignal(
		this._roleService.getAll(new RoleParams().setShowAll(true).setSortField('name')).pipe(
			map((res) => res?.items),
			catchError((err) => {
				console.error(err);
				this._ts.error('Error al cargar los roles');
				this._ref.close();
				return [];
			}),
		),
	);

	public resources = signal<Resource[]>([]);

	override buildForm(): void {
		const tmpPermission = this._permissionsService.parseRights(this.currentItem().permission);

		const idRole = this._config.data?.idRole;

		if (this.currentItem().idRole) this.getResources();
		else if (idRole) this.getResources(idRole);

		this._form = this._fb.group({
			idRole: [
				{ value: this.currentItem().idRole ?? idRole, disabled: !!this.currentItem()?.role?.id || !!idRole },
				[Validators.required],
			],
			idResource: [
				{ value: this.currentItem().idResource, disabled: !!this.currentItem()?.resource?.id },
				[Validators.required],
			],
			canView: [tmpPermission.CAN_READ],
			canUpdate: [tmpPermission.CAN_UPDATE],
			canCreate: [tmpPermission.CAN_CREATE],
			canDelete: [tmpPermission.CAN_DELETE],
			isAdmin: [tmpPermission.IS_ADMIN],
			isSuperAdmin: [tmpPermission.IS_SUPER_ADMIN],
		});

		if (tmpPermission.IS_SUPER_ADMIN) this.toggleAll(tmpPermission.IS_SUPER_ADMIN);

		this.controls['isSuperAdmin'].valueChanges.subscribe((value) => {
			this.toggleAll(value);
		});
	}

	private toggleAll(value: boolean): void {
		this.controls['canView'].setValue(value);
		this.controls['canUpdate'].setValue(value);
		this.controls['canCreate'].setValue(value);
		this.controls['canDelete'].setValue(value);
		this.controls['isAdmin'].setValue(value);
	}

	public isFormValid(): boolean {
		return (
			!this.controls['canView'].value &&
			!this.controls['canUpdate'].value &&
			!this.controls['canCreate'].value &&
			!this.controls['canDelete'].value &&
			!this.controls['isAdmin'].value &&
			!this.controls['isSuperAdmin'].value
		);
	}

	override onSubmit(): void {
		if (this.isFormValid() || this.form.invalid) return;
		const permission = this._permissionsService.getPermissionFromRights(this.form.value);

		const idRole = this._config.data?.idRole ?? this.form.controls['idRole'].value;

		const data = {
			idRole,
			idResource: this.form.controls['idResource'].value,
			permission,
		};

		const call$ =
			this.currentItem()?.idResource && this.currentItem()?.idRole
				? this._service.updatePermission(data)
				: this._service.create(data);

		call$.subscribe({
			next: (value) => {
				this._ts.success('Permiso guardado correctamente');
				this._ref.close(value);
			},
			error: () => {
				this._ts.error('Error al guardar el permiso');
			},
		});
	}

	public getResources(idRole?: number) {
		this._service.getResources(idRole).subscribe({
			next: (value) => {
				this.resources.set(value);
			},
			error: (err) => {
				console.error(err);
				this._ts.error('Error al cargar los recursos');
				this._ref.close();
				return [];
			},
		});
	}
}
