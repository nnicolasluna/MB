import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GeovisorMenuEntries, StateService } from '@modules/geovisor/services/state.service';
import { MapsComponent } from '../maps/maps.component';
import { GeoMonitoringSoilComponent } from '../geo-monitoring-soil/geo-monitoring-soil.component';
import { GeoMonitoringFireComponent } from '../monitoring-fire/monitoring-fire.component';
import { SideMonitoringUseComponent } from '../monitoring-use/monitoring-use.component';
import { SideMonitoringWaterComponent } from '../monitoring-water/monitoring-water.component';

@Component({
	selector: 'app-geo-sidebar',
	imports: [
		MapsComponent,
		SideMonitoringWaterComponent,
		GeoMonitoringFireComponent,
		GeoMonitoringSoilComponent,
		SideMonitoringUseComponent,
	],
	templateUrl: './geo-sidebar.component.html',
	styleUrl: './geo-sidebar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoSidebarComponent {
	private _geovisorState = inject(StateService);

	public currentMenus = GeovisorMenuEntries;
	public currentMenu = computed(() => {
		return this._geovisorState.currentMenu();
	});

	public title = computed(() => {
		return this._geovisorState.sidebarTitle();
	});

	public isShowingSidebar = computed(() => {
		return this._geovisorState.isShowingSidebar();
	});

	public close() {
		this._geovisorState.isShowingSidebar.set(false);
		this._geovisorState.currentMenu.set(GeovisorMenuEntries.NONE);
		setTimeout(() => {
			if (this._geovisorState.map) {
				this._geovisorState.map.invalidateSize();
			}
		}, 500);
	}

	getHeight() {
		const $menu = document.getElementById('geo-menu');

		return window.innerHeight - ($menu?.clientHeight ?? 0) - 16 + 'px';
	}
}
