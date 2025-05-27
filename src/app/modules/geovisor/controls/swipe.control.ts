import { Control, ControlOptions, DomEvent, DomUtil, Map, Layer } from 'leaflet';

interface SideBySideOptions extends ControlOptions {
	thumbSize?: number;
	padding?: number;
}

/**
 * @class SideBySideControl
 * @description
 * A control that adds a side-by-side view to compare different layers.
 * Supports multiple layers on each side.
 */
export class SideBySideControl extends Control {
	private _leftLayers: Layer[] = [];
	private _rightLayers: Layer[] = [];
	private _activeLayers: { left: Layer[]; right: Layer[] } = { left: [], right: [] };
	private _container!: HTMLElement;
	private _divider!: HTMLElement;
	private _range!: HTMLInputElement;
	private _mapWasDragEnabled: boolean = false;
	private _mapWasTapEnabled: boolean = false;
	private _map: any;

	override options: SideBySideOptions = {
		thumbSize: 42,
		padding: 0,
	};

	constructor(leftLayers: Layer | Layer[], rightLayers: Layer | Layer[], options?: SideBySideOptions) {
		super(options);
		this._leftLayers = this._asArray(leftLayers);
		this._rightLayers = this._asArray(rightLayers);

		if (options) {
			L.Util.setOptions(this, options);
		}
	}

	/**
	 * Get the position of the divider based on the range value
	 */
	override getPosition(): any {
		const rangeValue = parseFloat(this._range.value);
		const offset = (0.5 - rangeValue) * (2 * this.options.padding! + this.options.thumbSize!);
		return this._map.getSize().x * rangeValue + offset;
	}

	/**
	 * Set the position of the divider - noop in the original implementation
	 */
	override setPosition(): any {
		// This is intentionally a noop (no operation) function, preserving the original behavior
	}

	/**
	 * Add the control to a map
	 */
	override onAdd(map: any): HTMLElement {
		this._map = map;

		const container = (this._container = DomUtil.create('div', 'leaflet-sbs', map._controlContainer));

		this._divider = DomUtil.create('div', 'leaflet-sbs-divider', container);
		const range = (this._range = DomUtil.create('input', 'leaflet-sbs-range', container) as HTMLInputElement);
		range.type = 'range';
		range.min = '0';
		range.max = '1';
		range.step = 'any';
		range.value = '0.5';
		range.style.paddingLeft = range.style.paddingRight = this.options.padding + 'px';

		this._addEvents();
		this._updateLayers();

		return container;
	}

	/**
	 * Remove the control from a map
	 */
	override onRemove(): this {
		if (!this._map) {
			return this;
		}

		// Reset clip for all layers
		this._activeLayers.left.forEach((layer) => {
			if ((layer as any).getContainer) {
				(layer as any).getContainer().style.clip = '';
			}
		});

		this._activeLayers.right.forEach((layer: any) => {
			if (layer.getContainer) {
				layer.getContainer().style.clip = '';
			}
		});

		this._removeEvents();
		DomUtil.remove(this._container);

		this._map = null!;

		return this;
	}

	/**
	 * Set the left layer(s)
	 */
	setLeftLayers(leftLayers: Layer | Layer[]): this {
		this._leftLayers = this._asArray(leftLayers);
		this._updateLayers();
		return this;
	}

	/**
	 * Set the right layer(s)
	 */
	setRightLayers(rightLayers: Layer | Layer[]): this {
		this._rightLayers = this._asArray(rightLayers);
		this._updateLayers();
		return this;
	}

	/**
	 * Get all active left layers
	 */
	getLeftLayers(): Layer[] {
		return this._activeLayers.left;
	}

	/**
	 * Get all active right layers
	 */
	getRightLayers(): Layer[] {
		return this._activeLayers.right;
	}

	/**
	 * Update the clip paths for the layers
	 */
	private _updateClip(): void {
		const map = this._map;
		const nw = map.containerPointToLayerPoint([0, 0]);
		const se = map.containerPointToLayerPoint(map.getSize());
		const clipX = nw.x + this.getPosition();
		const dividerX = this.getPosition();

		this._divider.style.left = dividerX + 'px';
		this._map.fire('dividermove', { x: dividerX });

		const clipLeft = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
		const clipRight = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)';

		// Apply clip to all active left layers
		this._activeLayers.left.forEach((layer: any) => {
			if (layer.getContainer) {
				layer.getContainer().style.clip = clipLeft;
			}
		});

		// Apply clip to all active right layers
		this._activeLayers.right.forEach((layer: any) => {
			if (layer.getContainer) {
				layer.getContainer().style.clip = clipRight;
			}
		});
	}

	/**
	 * Update the layers
	 */
	private _updateLayers(): void {
		if (!this._map) {
			return;
		}

		const prevLeftLayers = [...this._activeLayers.left];
		const prevRightLayers = [...this._activeLayers.right];

		// Reset active layers
		this._activeLayers.left = [];
		this._activeLayers.right = [];

		// Collect all active left layers
		this._leftLayers.forEach((layer) => {
			if (this._map.hasLayer(layer)) {
				this._activeLayers.left.push(layer);
			}
		});

		// Collect all active right layers
		this._rightLayers.forEach((layer) => {
			if (this._map.hasLayer(layer)) {
				this._activeLayers.right.push(layer);
			}
		});

		// Fire events for removed left layers
		prevLeftLayers.forEach((layer) => {
			if (!this._activeLayers.left.includes(layer)) {
				this._map.fire('leftlayerremove', { layer });
			}
		});

		// Fire events for added left layers
		this._activeLayers.left.forEach((layer) => {
			if (!prevLeftLayers.includes(layer)) {
				this._map.fire('leftlayeradd', { layer });
			}
		});

		// Fire events for removed right layers
		prevRightLayers.forEach((layer) => {
			if (!this._activeLayers.right.includes(layer)) {
				this._map.fire('rightlayerremove', { layer });
			}
		});

		// Fire events for added right layers
		this._activeLayers.right.forEach((layer) => {
			if (!prevRightLayers.includes(layer)) {
				this._map.fire('rightlayeradd', { layer });
			}
		});

		this._updateClip();
	}

	/**
	 * Add events to the control
	 */
	private _addEvents(): void {
		const range = this._range;
		const map = this._map;

		if (!map || !range) return;

		map.on('move', this._updateClip, this);
		map.on('layeradd layerremove', this._updateLayers, this);

		DomEvent.on(range, this._getRangeEvent(range), this._updateClip, this);
		DomEvent.on(range, 'touchstart mousedown', this._cancelMapDrag, this);
		DomEvent.on(range, 'touchend mouseup', this._uncancelMapDrag, this);
	}

	/**
	 * Remove events from the control
	 */
	private _removeEvents(): void {
		const range = this._range;
		const map = this._map;

		if (range) {
			DomEvent.off(range, this._getRangeEvent(range), this._updateClip, this);
			DomEvent.off(range, 'touchstart mousedown', this._cancelMapDrag, this);
			DomEvent.off(range, 'touchend mouseup', this._uncancelMapDrag, this);
		}

		if (map) {
			map.off('layeradd layerremove', this._updateLayers, this);
			map.off('move', this._updateClip, this);
		}
	}

	/**
	 * Get the range event name
	 */
	private _getRangeEvent(rangeInput: HTMLInputElement): string {
		return 'oninput' in rangeInput ? 'input' : 'change';
	}

	/**
	 * Cancel map drag when the range is being dragged
	 */
	private _cancelMapDrag(): void {
		this._mapWasDragEnabled = this._map.dragging.enabled();
		this._mapWasTapEnabled = this._map.tap && this._map.tap.enabled();
		this._map.dragging.disable();
		this._map.tap && this._map.tap.disable();
	}

	/**
	 * Uncancel map drag when the range is not being dragged
	 */
	private _uncancelMapDrag(e: Event): void {
		if (this._mapWasDragEnabled) {
			this._map.dragging.enable();
		}
		if (this._mapWasTapEnabled) {
			this._map.tap.enable();
		}
	}

	/**
	 * Convert an argument to an array
	 */
	private _asArray(arg: any): Layer[] {
		return arg === undefined ? [] : Array.isArray(arg) ? arg : [arg];
	}
}

/**
 * Factory function for creating a new SideBySideControl
 */
export function sideBySideControl(
	leftLayers: Layer | Layer[],
	rightLayers: Layer | Layer[],
	options?: SideBySideOptions,
): SideBySideControl {
	return new SideBySideControl(leftLayers, rightLayers, options);
}

// Asegurarse de que L está definido para compatibilidad
declare var L: any;
