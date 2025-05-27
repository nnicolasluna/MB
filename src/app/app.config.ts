import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizationInterceptor } from './shared/interceptors/authorization.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastService } from '@shared/services';
import { DialogService } from 'primeng/dynamicdialog';
import { errorInterceptor } from '@shared/interceptors/error.interceptor';
import { ConfirmService } from '@shared/services/confirm.service';
import { providePrimeNG } from 'primeng/config';
import { themePreset } from './config/theme/theme';
import { TRANSLATIONS } from './config/translations/primeng.translation';

export const appConfig: ApplicationConfig = {
	providers: [
		MessageService,
		ToastService,
		DialogService,
		ConfirmationService,
		ConfirmService,

		provideAnimationsAsync(),
		providePrimeNG({
			ripple: true,
			translation: TRANSLATIONS,
			theme: {
				preset: themePreset,
				options: {
					darkModeSelector: '.dark',
					cssLayer: {
						name: 'primeng',
						order: 'theme, base, primeng',
					},
				},
			},
		}),

		provideExperimentalZonelessChangeDetection(),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authorizationInterceptor, errorInterceptor])),
	],
};
