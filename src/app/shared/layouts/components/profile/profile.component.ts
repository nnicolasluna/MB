import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@modules/auth/services/auth.service';
import { InputTextComponent } from '@shared/components';
import { CredentialsService, ToastService } from '@shared/services';
import { matchValuesValidator } from '@shared/validators';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-profie',
    imports: [ReactiveFormsModule, InputTextComponent, ButtonModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
	public isLoading = signal(false);

	private _ts = inject(ToastService);
	private _ref = inject(DynamicDialogRef);
	private _fb = inject(FormBuilder);
	private _authService = inject(AuthService);
	private _credentiaslService = inject(CredentialsService);
	public currentUser = this._credentiaslService.getUser();

	private _form: FormGroup;

	get form(): FormGroup {
		return this._form;
	}

	get controls() {
		return this._form.controls;
	}

	constructor() {
		this._form = this._fb.group(
			{
				oldPassword: [null, [Validators.required]],
				newPassword: [
					null,
					[
						Validators.required,
						Validators.minLength(8),
						Validators.maxLength(50),
						Validators.pattern(/[a-z]/),
						Validators.pattern(/[A-Z]/),
						Validators.pattern(/\d/),
						Validators.pattern(/\W|_/),
					],
				],
				repeatPassword: [null, [Validators.required]],
			},
			{ validators: matchValuesValidator(['newPassword', 'repeatPassword']) } as AbstractControlOptions,
		);
	}

	public onSubmit() {
		if (this.form.invalid) return;

		const data = this.form.value;
		delete data.repeatPassword;

		this._authService.changePassword(this.form.value).subscribe({
			next: (success) => {
				if (success) {
					this._ts.success('Contraseña cambiada correctamente');
					this._authService.logout();
					this._ref.close();
				}
			},
			error: () => {
				this._ts.error('Error al cambiar la contraseña');
			},
		});
	}

	public close() {
		this._ref.close();
	}
}
