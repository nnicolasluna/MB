import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStatus } from '@modules/auth/interfaces/auth-status.enum';
import { AuthService } from '@modules/auth/services/auth.service';
import { CredentialsService } from '@shared/services';
import { firstValueFrom } from 'rxjs';

export const authenticationGuard: CanActivateFn = (_route, _state) => {
	const router = inject(Router);
	const credentialsService = inject(CredentialsService);
	const authService = inject(AuthService);

	if (credentialsService.authStatus() === AuthStatus.authenticated) {
		return firstValueFrom(authService.checkToken(credentialsService.getToken() ?? ''))
			.then((res) => Boolean(res))
			.catch(() => false);
	}

	router.navigate(['/auth/login'], { queryParams: { redirect: _state.url } });
	return false;
};
