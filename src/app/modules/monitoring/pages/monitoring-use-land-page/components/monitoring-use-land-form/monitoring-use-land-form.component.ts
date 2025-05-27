import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { latLng, LatLngBounds, Map, tileLayer } from 'leaflet';
import { PanelModule } from 'primeng/panel';
import { DatePickerModule } from 'primeng/datepicker';
import { environment } from '@environments/environment';
import { Subscription } from 'rxjs';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { NotificationSocket } from '@shared/services/notification-socket.service';
import { MapUploadStatus, uploadMessages } from '@modules/map-data/constants';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { requiredFileType } from '@shared/validators/required-file-type.validator';
import { toFormData } from '@shared/utils/to-form-data';
import { MonitoringUse } from '@modules/monitoring/interfaces/monitoring-use/monitoring-use.interface';
import { MonitoringUseService } from '@modules/monitoring/services/monitoring-use.service';

@Component({
	selector: 'app-monitoring-use-land-form',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		LoaderComponent,
		InputErrorComponent,
		InputTextComponent,
		LeafletModule,
		FileUploadModule,
		DatePickerModule,
		PanelModule,
		StepperModule,
		ButtonModule,
	],
	templateUrl: './monitoring-use-land-form.component.html',
	styleUrl: './monitoring-use-land-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringUseLandFormComponent extends BaseFormComponent<MonitoringUse> {
	public currentStep = model(1);
	public uploadStatus = model(MapUploadStatus.PENDING);
	public uploadMessage = computed(() => {
		return uploadMessages[this.uploadStatus()];
	});
	public showUpload = computed(() =>
		[MapUploadStatus.FAILED, MapUploadStatus.PENDING, MapUploadStatus.COMPLETED].includes(this.uploadStatus()),
	);
	private clearCacheNumber = 0;

	override _service = inject(MonitoringUseService);

	public mapOptions = {
		layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })],
		zoom: 5,
		center: latLng(-16.889, -65.567),
	};

	public mapLayer = tileLayer('');
	private _map?: Map;

	private maximize$?: Subscription;

	private socket = inject(NotificationSocket);

	override ngOnDestroy(): void {
		if (this.currentItem()?.uuid) this.socket.removeListener(this.currentItem().uuid);
		this.maximize$?.unsubscribe();
		this._ref.close();
	}

	public onMapReady(map: Map): void {
		this._map = map;
		if (this.maximize$) this.maximize$.unsubscribe();
		this.maximize$ = this._ref.onMaximize.subscribe(() => {
			setTimeout(() => {
				map.invalidateSize();
			}, 500);
		});

		if (this.currentItem().bbox) this.loadMapData();
	}

	override buildForm(): void {
		this.isLoading.set(true);

		const contentDate = this.currentItem().coverageDate ? new Date(this.currentItem().coverageDate) : new Date();

		this._form = this._fb.group({
			name: [this.currentItem().name, [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
			description: [this.currentItem().description ?? '', [Validators.maxLength(300), Validators.minLength(3)]],
			coverageDate: [contentDate, [Validators.required]],
			file: [null, [requiredFileType('zip')]],
		});

		if (!this.currentItem().id) this._form.get('file')?.addValidators([Validators.required]);

		this.isLoading.set(false);

		if (this.isViewMode()) this._form.disable();
	}

	public saveForm(): void {
		if (this._form.invalid) return;

		const data = toFormData(this._form.value);

		this._form.disable();
		this.isLoading.set(true);

		const service = this.currentItem().id
			? this._service.update(this.currentItem().id, data)
			: this._service.create(data);

		service.subscribe({
			next: (res) => {
				this.currentItem.set(res);
				this.isLoading.set(false);

				if (data.has('file'))
					this.socket.on(this.currentItem().layer, (data: { mapCode: string; progress: MapUploadStatus }) => {
						this.progressHandler(data);
					});
				else {
					this.currentStep.set(2);
				}
			},
			error: (_err) => {
				this.isLoading.set(false);
				this._ts.error('Error al guardar los datos del mapa');
				this._form.enable();
			},
		});
	}

	private progressHandler(data: { mapCode: string; progress: MapUploadStatus }) {
		this.uploadStatus.set(data.progress);
		if (data.progress === MapUploadStatus.COMPLETED) {
			this._ts.success('Mapa subido correctamente');
			this._service.getById(this.currentItem().id).subscribe({
				next: (res) => {
					this.currentItem.set(res);
					this.loadMapData();
					this.currentStep.set(2);
				},
			});
		} else if (data.progress === MapUploadStatus.FAILED) {
			this._ts.error('Error al procesar el mapa');
			this._form.enable();
		}
	}

	public onSelect(event: FileSelectEvent) {
		this._form.patchValue({
			file: event.files?.[0] ?? null,
		});
	}

	private loadMapData(): void {
		const geoserverUrl = environment.urlGeoserver.endsWith('/')
			? environment.urlGeoserver.slice(0, -1)
			: environment.urlGeoserver;
		const url = `${geoserverUrl}/${environment.workspaceGeoserver}/wms`;

		const { min_x, min_y, max_x, max_y } = JSON.parse(this.currentItem().bbox);

		const opts: any = {
			layers: `${this.currentItem().layer}`,
			format: 'image/png',
			opacity: 1,
			transparent: true,
			version: '1.3.0',
			accessToken: `&${this.clearCacheNumber++}`,
		};

		if (this.currentItem()?.styleName) opts.styles = this.currentItem()!.styleName;

		this.mapLayer = tileLayer.wms(url, opts);

		this._cdr.detectChanges();

		this._map?.fitBounds(new LatLngBounds([min_y, min_x], [max_y, max_x]), { padding: [50, 50] });
	}

	override onSubmit(): void {
		if (this.currentStep() === 1) {
			this.saveForm();
			return;
		}

		this._ref.close({});
	}
}
