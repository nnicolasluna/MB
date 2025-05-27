import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GeovisorMenuEntries, StateService } from '@modules/geovisor/services/state.service';

@Component({
	selector: 'app-geo-menu',
	imports: [NgIf],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
	public isOpen = signal(true);
	public isSecondLevelOpen = signal(true);

	public menuEntries = GeovisorMenuEntries;
	private _geovisorState = inject(StateService);

	constructor() {}

	onMenuClick(menu: GeovisorMenuEntries) {
		if (menu === this._geovisorState.currentMenu() && this._geovisorState.isShowingSidebar()) {
			this._geovisorState.isShowingSidebar.set(false);
			setTimeout(() => {
				this._geovisorState.map?.invalidateSize();
			}, 300);
			return;
		}
		if (menu) this._geovisorState.currentMenu.set(menu);
		this._geovisorState.isShowingSidebar.set(true);
		this._geovisorState.isShowingLeftSidebar.set(false);

		setTimeout(() => {
			this._geovisorState.map?.invalidateSize();
		}, 300);
		this.changeTitle(menu);
	}

	changeTitle(menu: GeovisorMenuEntries) {
		switch (menu) {
			case GeovisorMenuEntries.HOME:
				return this._geovisorState.sidebarTitle.set('INICIO');
			case GeovisorMenuEntries.MONITORING_WATER:
				return this._geovisorState.sidebarTitle.set('Monitoreo de Agua');
			case GeovisorMenuEntries.MAPS:
				this.isSecondLevelOpen.set(false);
				return this._geovisorState.sidebarTitle.set('Coberturas');

			case GeovisorMenuEntries.MONITORING_LAND_USE:
				return this._geovisorState.sidebarTitle.set('Uso de suelo');
			case GeovisorMenuEntries.MONITORING_FIRE:
				return this._geovisorState.sidebarTitle.set('Monitoreo de Fuego');
			case GeovisorMenuEntries.MONITORING_SOIL_DEGRADATION:
				return this._geovisorState.sidebarTitle.set('Degradación del Suelo');
		}
	}

	isActive(menu: GeovisorMenuEntries) {
		return this._geovisorState.currentMenu() == menu && this._geovisorState.isShowingSidebar();
	}

	isSidebarOpen() {
		return this._geovisorState.isShowingSidebar();
	}

	onClickMonitoring() {
		this.isSecondLevelOpen.set(!this.isSecondLevelOpen());
	}

	onCloseAll() {
		if (this.isOpen()) {
			this.isOpen.set(false);
			this.isSecondLevelOpen.set(false);
		} else {
			this.isOpen.set(true);
		}
	}
}
