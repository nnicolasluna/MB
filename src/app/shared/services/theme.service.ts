import { computed, Injectable, signal } from '@angular/core';
import { THEME_KEY } from '@shared/constants/theme';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	public currentTheme = signal<'light' | 'dark'>('light');

	public isDarkMode = computed(() => this.currentTheme() === 'dark');

	private _key = THEME_KEY;

	constructor() {
		this.getFromLocalStorage();
		this.toggleClass();
	}

	private getFromLocalStorage() {
		const theme = localStorage.getItem(this._key);
		if (!theme || theme !== 'dark') {
			this.currentTheme.set('light');
		} else {
			this.currentTheme.set('dark');
		}
	}

	private toggleClass() {
		const element = document.querySelector('html');
		element?.classList.toggle('dark', this.isDarkMode());
		localStorage.setItem(this._key, this.currentTheme());
	}

	public toggleDarkMode() {
		this.currentTheme.set(this.isDarkMode() ? 'light' : 'dark');
		this.toggleClass();
	}
}
