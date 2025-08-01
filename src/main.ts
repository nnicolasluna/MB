import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

if (environment.production) enableProdMode();

registerLocaleData(localeEs, 'es');

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
