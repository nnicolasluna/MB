import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../../modules/auth/interfaces/auth-status.enum';
import { AccessTo, LoginResponse } from '@modules/auth/interfaces/login-response.interface';
import { UserModel } from '@modules/users/interfaces';
import { NotificationSocket } from './notification-socket.service';

@Injectable({
	providedIn: 'root',
})
export class CredentialsService {
	private _currentUser = signal<UserModel | null>(null);
	private _authStatus = signal<AuthStatus>(AuthStatus.notAuthenticated);

	public currentUser = computed(() => this._currentUser());

	public authStatus() {
		if (this.getToken() === null) this._authStatus.set(AuthStatus.notAuthenticated);
		else this._authStatus.set(AuthStatus.authenticated);

		return this._authStatus();
	}

	private socket = inject(NotificationSocket);

	constructor() {}

	saveCredentials(data: LoginResponse) {
		this.socket.connect();
		this._currentUser.set(data.user);
		this._authStatus.set(AuthStatus.authenticated);

		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user));
		localStorage.setItem('access', JSON.stringify(data.accessTo));
	}

	removeCredentials() {
		this.socket.disconnect();
		this._currentUser.set(null);
		this._authStatus.set(AuthStatus.notAuthenticated);

		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('access');
	}

	getToken(): string | null {
		return localStorage.getItem('token');
	}

	getAccess(): { [key: string]: AccessTo } | null {
		const access = localStorage.getItem('access');
		return access ? JSON.parse(access) : null;
	}

	getUser(): UserModel | null {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}
}
