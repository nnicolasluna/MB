import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeovisorService } from '@modules/geovisor/services/geovisor.service';
import { StateService } from '@modules/geovisor/services/state.service';
import { MapData, MapDataParams } from '@modules/map-data/interfaces';
import { ToastService } from '@shared/services';
import { ButtonModule } from 'primeng/button';
import { DataViewLazyLoadEvent, DataViewModule } from 'primeng/dataview';
import { SliderModule } from 'primeng/slider';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ItemMapComponent } from '../item-map/item-map.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
	selector: 'app-geo-maps',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ItemMapComponent,
		InputTextModule,
		ButtonModule,
		DataViewModule,
		SliderModule,
	],
	templateUrl: './maps.component.html',
	styleUrl: './maps.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsComponent {
	private _ts = inject(ToastService);
	private _geovisorState = inject(StateService);
	private _geovisorService = inject(GeovisorService);

	public searchField = new FormControl();

	public totalMaps = signal(0);
	public maps = signal<MapData[]>([]);

	constructor() {
		this.searchField.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
			this.onMapsLoad({ first: 0, rows: 6, sortField: 'id', sortOrder: 1 });
		});
	}

	public onMapsLoad(event: DataViewLazyLoadEvent) {
		const params = new MapDataParams();
		params.defineFromDataViewLazyLoadEvent(event);
		if (this.searchField.value) params.setSearch(this.searchField.value);

		this._geovisorService.getMapData(params).subscribe({
			next: (res) => {
				res.items.forEach((map) => {
					const exists = this._geovisorState.activeIdMaps.find(({ id }) => id === map.id);
					map.isAdded = !!exists;
					map.opacity = exists?.opacity ?? 1;
					map.tileMap = exists?.tileMap as any;
				});
				this.maps.set(res.items);
				this.totalMaps.set(res.total);
			},
			error: () => {
				this._ts.error('Error al cargar los mapas');
			},
		});
	}
}
