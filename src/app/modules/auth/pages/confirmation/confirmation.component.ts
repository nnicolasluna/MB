import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { InputTextComponent } from '@shared/components';
import { ToastService, ThemeService } from '@shared/services';
import { matchValuesValidator } from '@shared/validators';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

@Component({
	selector: 'app-confirmation',
	imports: [
		RouterModule,
		ReactiveFormsModule,
		InputTextComponent,
		PasswordModule,
		RippleModule,
		ButtonModule,
		CardModule,
		InputTextModule,
	],
	templateUrl: './confirmation.component.html',
	styleUrl: './confirmation.component.scss',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ConfirmationComponent {
	public isLoading = signal(false);
	public _form: FormGroup;

	get controls() {
		return this._form.controls;
	}

	get form() {
		return this._form;
	}

	private _ts = inject(ToastService);
	private _fb = inject(FormBuilder);
	private _activatedRoute = inject(ActivatedRoute);
	private _router = inject(Router);
	private _authService = inject(AuthService);
	private _themeService = inject(ThemeService);

	private _token: string | null = null;

	constructor() {
		this._form = this._fb.group(
			{
				username: [null, Validators.required],
				email: [null, [Validators.required, Validators.email]],
				password: [
					null,
					[
						Validators.required,
						Validators.minLength(8),
						Validators.maxLength(20),
						Validators.pattern(/[a-z]/),
						Validators.pattern(/[A-Z]/),
						Validators.pattern(/\d/),
						Validators.pattern(/\W|_/),
					],
				],
				repeatPassword: [null, [Validators.required]],
			},
			{ validators: [matchValuesValidator(['password', 'repeatPassword'])] } as AbstractControlOptions,
		);

		this._activatedRoute.paramMap.subscribe((params) => {
			this._token = params.get('token');

			if (!this._token) {
				this._router.navigate(['/auth/login']);
				return;
			}

			this._authService.checkVerificationCode(this._token).subscribe({
				next: (resp: any) => {
					this.controls['username'].setValue(resp.user);
					this.controls['email'].setValue(resp.email);
				},
			});
		});
	}

	public submit() {
		if (this._form.invalid || !this._token) return;

		const data = {
			email: this.controls['email'].value,
			password: this.controls['password'].value,
			verificationCode: this._token,
		};

		this.isLoading.set(true);

		this._authService.confirm(data).subscribe({
			next: (success) => {
				this.isLoading.set(false);
				this._ts.success('Cuenta confirmada correctamente');
				if (success) this._router.navigate(['/auth/login']);
			},
			error: () => {
				this.isLoading.set(false);
				this._ts.error('Error confirmando la cuenta');
			},
		});
	}

	public toggleDarkMode() {
		this._themeService.toggleDarkMode();
	}
}
