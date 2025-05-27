import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleParams, UserModel } from '@modules/users/interfaces';
import { RoleService } from '@modules/users/services/role.service';
import { UserService } from '@modules/users/services/user.service';
import { InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { IAttachment } from '@shared/interfaces';
import { checkIfExistsValidator } from '@shared/validators';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { catchError, map } from 'rxjs';

@Component({
	selector: 'app-user-form',
	imports: [
		ReactiveFormsModule,
		InputErrorComponent,
		SelectModule,
		InputTextComponent,
		StepperModule,
		ButtonModule,
		DatePickerModule,
		InputFileComponent,
	],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent extends BaseFormComponent<UserModel> {
	override _service = inject(UserService);

	public image = signal<IAttachment[] | undefined>(undefined);

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

	override buildForm(): void {
		const expirationAccount = this.currentItem()?.expirationAccount
			? new Date(this.currentItem().expirationAccount)
			: null;

		this._form = this._fb.group({
			name: [this.currentItem().name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			firstSurname: [
				this.currentItem().firstSurname,
				[Validators.required, Validators.minLength(3), Validators.maxLength(50)],
			],
			secondSurname: [
				this.currentItem().secondSurname,
				[Validators.required, Validators.minLength(3), Validators.maxLength(50)],
			],
			ci: [this.currentItem().ci, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
			address: [this.currentItem().address, [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],

			email: [this.currentItem().email, [Validators.required, Validators.email]],
			username: [
				this.currentItem().username,
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(30),
					Validators.pattern(/^[a-zA-Z0-9_ñÑ]+$/),
				],
			],
			phone: [this.currentItem().phone, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
			idRole: [this.currentItem().role?.id, [Validators.required, Validators.min(1)]],
			idImage: [this.currentItem().image?.id, []],
			expirationAccount: [expirationAccount, Validators.required],
		});

		if (this.currentItem().image) this.image.set([this.currentItem().image]);

		if (!this.currentItem()?.id) {
			this._form.get('ci')?.setAsyncValidators([checkIfExistsValidator('ci', this._service)]);
			this._form.get('email')?.setAsyncValidators([checkIfExistsValidator('email', this._service)]);
			this._form.get('username')?.setAsyncValidators([checkIfExistsValidator('username', this._service)]);
		}
	}

	public onFileUploaded(event: any) {
		const { files } = event;
		if (files?.length) {
			this._form.patchValue({
				idImage: files[0].id,
			});
			this.image.set(files);
		}
	}

	public isSecondPartComplete() {
		const controls = ['email', 'username', 'phone', 'idEntity'];
		return this._isPartComplete(controls);
	}

	public isFirstPartComplete() {
		const controls = ['firstName', 'secondName', 'firstSurname', 'secondSurname', 'ci', 'birthDate'];
		return this._isPartComplete(controls);
	}
}
