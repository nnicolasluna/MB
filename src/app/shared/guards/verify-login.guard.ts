import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStatus } from '@modules/auth/interfaces/auth-status.enum';
import { CredentialsService } from '@shared/services';

export const verifyLoginGuard: CanActivateFn = (_route, _state) => {
	const authService = inject(CredentialsService);
	const router = inject(Router);

	if (authService.authStatus() === AuthStatus.authenticated) {
		router.navigate(['/home']);
	}

	return true;
};
