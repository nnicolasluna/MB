import { inject, Injectable } from '@angular/core';
import { BaseHttpService, CredentialsService } from '@shared/services';
import { map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService extends BaseHttpService {
	private credentialsService = inject(CredentialsService);
	private router = inject(Router);

	constructor() {
		super('auth');
	}

	public changePassword(data: { email: string; password: string; verificationCode: string }) {
		return this.http.post<boolean>(`${this.namespace}/change-password`, data);
	}

	public confirm(data: { email: string; password: string; verificationCode: string }) {
		return this.http.post<boolean>(`${this.namespace}/confirmation`, data);
	}

	public checkVerificationCode(token: string) {
		return this.http.get(`${this.namespace}/verify/${token}`);
	}

	public checkToken(token: string) {
		return this.http.get(`${this.namespace}/verify/${token}`);
	}

	public forgotPassword(data: { email: string }): Observable<boolean> {
		return this.http.post<boolean>(`${this.namespace}/forgot-password`, data);
	}

	public login(data: LoginRequest): Observable<boolean> {
		const url = `${this.namespace}/login`;

		return this.http.post<LoginResponse>(url, data).pipe(
			tap((res) => {
				this.credentialsService.saveCredentials(res);
			}),
			map(() => true),
		);
	}

	public logout() {
		this.credentialsService.removeCredentials();
		this.router.navigate(['/auth/login']);
	}
}
