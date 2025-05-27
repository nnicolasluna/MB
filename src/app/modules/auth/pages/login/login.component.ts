import { ChangeDetectionStrategy, Component, inject, signal, OnInit, viewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from '@shared/components/';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
import { AuthService } from '../../services/auth.service';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ThemeService } from '@shared/services';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpStatusCode } from '@angular/common/http';

@Component({
	selector: 'app-login',
	imports: [
		RouterModule,
		ReactiveFormsModule,
		InputTextComponent,
		PasswordModule,
		RippleModule,
		ButtonModule,
		CardModule,
		CheckboxModule,
		InputTextModule,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
	public isLoading = signal(false);
	public loginForm: FormGroup;

	get controls() {
		return this.loginForm.controls;
	}

	get form() {
		return this.loginForm;
	}

	private _ts = inject(ToastService);
	private _fb = inject(FormBuilder);
	private _router = inject(Router);
	private _authService = inject(AuthService);
	private _themeService = inject(ThemeService);

	constructor() {
		this.loginForm = this._fb.group({
			username: ['', [Validators.required, Validators.maxLength(100)]],
			password: ['', [Validators.required, Validators.maxLength(60)]],
			remember: [false],
		});
	}

	private videoBackground = viewChild<ElementRef<HTMLVideoElement>>('videoBackground');

	async ngOnInit() {
		try {
			const video = this.videoBackground()?.nativeElement;
			await video?.play();
			const isMuted = video?.muted;
			if (!isMuted && video) {
				video.muted = true;
			}
		} catch (error) {
			console.error(error);
		}
	}

	public loginSubmit(): void {
		if (this.loginForm.invalid) return;

		this.isLoading.set(true);

		this._authService.login(this.loginForm.value).subscribe({
			next: (success) => {
				this.isLoading.set(false);
				if (success) this._router.navigate(['/home']);
			},
			error: (error) => {
				if (error?.error?.statusCode === HttpStatusCode.TooManyRequests) {
					this._ts.error('Ya no cuenta con intentos, pruebe nuevamente en 24 horas');
				}
				if (error?.error?.statusCode === HttpStatusCode.Forbidden) {
					this._ts.error('Usuario bloqueado');
				} else {
					this._ts.error('Error al iniciar sesión');
				}

				this.isLoading.set(false);
			},
		});
	}

	public toggleDarkMode(): void {
		this._themeService.toggleDarkMode();
	}
}
