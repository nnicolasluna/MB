import { Control, ControlOptions, DomEvent, DomUtil } from 'leaflet';

interface ToggleItemOptions extends ControlOptions {
	iconOn?: string;
	iconOnHtml?: string;
	iconOff?: string;
	iconOffHtml?: string;
	isVisible?: boolean;
	title?: string;
}

/**
 * @class ToggleItemControl
 * @description
 *	A generic control to toggle visibility of a component/element with a callback.
 *	This class needs this CSS Clases: toggle-item-control, toggle-button, leaflet-custom-active
 */
export class ToggleItemControl extends Control {
	private cb: (value: boolean, e?: Event) => void;

	override options: ToggleItemOptions = {};

	private _container!: HTMLElement;
	private _button!: HTMLElement;

	constructor(cb: (value: boolean, event?: Event) => void, options?: ToggleItemOptions) {
		super(options);
		this.options.position = options?.position || 'topleft';
		this.options.iconOn = options?.iconOn || 'pi pi-chevron-right';
		this.options.iconOff = options?.iconOff || 'pi pi-chevron-left';
		this.options.isVisible = options?.isVisible ?? false;
		this.options.title = options?.title || 'Ocultar/Mostrar';
		this.options.iconOnHtml = options?.iconOnHtml;
		this.options.iconOffHtml = options?.iconOffHtml;
		this.cb = cb;
	}

	override onAdd(_: L.Map): HTMLElement {
		this._container = DomUtil.create('div', 'toggle-item-control leaflet-bar leaflet-control');
		this._button = DomUtil.create('a', 'toggle-button', this._container);
		this._container.title = this.options.title!;
		this._button.role = 'button';
		this._button.innerHTML = this.getIcon();

		if (this.options.isVisible) {
			this.cb(true, null as unknown as Event);
			this.setVisibility(this.options.isVisible);
		}

		DomEvent.on(this._button, 'click', (e) => {
			DomEvent.stopPropagation(e);
			this.options.isVisible = !this.options.isVisible;
			this._button.innerHTML = this.getIcon();
			this._container.classList.toggle('leaflet-custom-active', this.options.isVisible);
			this.cb(this.options.isVisible, e);
		});

		return this._container;
	}

	private getIcon(): string {
		if (this.options.isVisible) {
			if (this.options.iconOnHtml) {
				return this.options.iconOnHtml;
			} else {
				return `<i class="${this.options.iconOn}"></i>`;
			}
		} else {
			if (this.options.iconOffHtml) {
				return this.options.iconOffHtml;
			} else {
				return `<i class="${this.options.iconOff}"></i>`;
			}
		}
	}

	public setVisibility(value: boolean): void {
		this.options.isVisible = value;
		this._container.classList.toggle('leaflet-custom-active', value);
		this._button.innerHTML = this.getIcon();
		this.cb(value);
	}

	public getVisibility(): boolean {
		return this.options.isVisible!;
	}
}
