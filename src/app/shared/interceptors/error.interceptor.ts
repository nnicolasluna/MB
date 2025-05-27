import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToastService } from '@shared/services';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const router = inject(Router);
	const ts = inject(ToastService);

	return next(req).pipe(
		catchError((error) => {
			console.error(error);
			switch (true) {
				case error.status === 0:
					if (!navigator.onLine) ts.error('No hay conexión a internet');
					else ts.error('Error de conexión');
					authService.logout();
					router.navigate(['/auth/login']);
					break;
				case error.status === HttpStatusCode.Unauthorized:
					if (!req.url.includes('auth')) ts.error('No autorizado');
					authService.logout();
					break;
				case error.status >= HttpStatusCode.InternalServerError:
					ts.error('Error en el servidor comuníquese con el administrador');
					break;
			}
			return throwError(() => error);
		}),
	);
};
