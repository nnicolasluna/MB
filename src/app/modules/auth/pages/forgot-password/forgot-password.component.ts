import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { InputTextComponent } from '@shared/components';
import { ToastService, ThemeService } from '@shared/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

@Component({
	selector: 'app-forgot-password',
	imports: [RouterModule, ReactiveFormsModule, InputTextComponent, RippleModule, ButtonModule, CardModule],
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
	public isLoading = signal(false);
	private _form: FormGroup;

	get controls() {
		return this._form.controls;
	}

	get form() {
		return this._form;
	}

	private _ts = inject(ToastService);
	private _fb = inject(FormBuilder);
	private _router = inject(Router);
	private _authService = inject(AuthService);
	private _themeService = inject(ThemeService);

	constructor() {
		this._form = this._fb.group({
			email: [null, [Validators.required, Validators.email]],
		});
	}

	public submit(): void {
		if (this.form.invalid) return;

		this.isLoading.set(true);

		this._authService.forgotPassword(this.form.value).subscribe({
			next: (success) => {
				this.isLoading.set(false);
				if (success) {
					this._router.navigate(['/auth/login']);
					this._ts.success('Correo de recuperación enviado correctamente');
				}
			},
			error: () => {
				this.isLoading.set(false);
				this._ts.error('Error al mandar el correo de recuperación');
			},
		});
	}

	public toggleDarkMode(): void {
		this._themeService.toggleDarkMode();
	}

	public goBack(): void {
		this._router.navigate(['/auth/login']);
	}
}
