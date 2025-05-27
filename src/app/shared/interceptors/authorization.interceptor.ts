import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CredentialsService } from '@shared/services';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
	const credentialsService = inject(CredentialsService);
	const token = credentialsService.getToken();

	if (!token) return next(req);

	const authReq = req.clone({
		headers: req.headers.set('Authorization', `Bearer ${token}`),
	});

	return next(authReq);
};
