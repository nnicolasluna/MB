import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { MapData } from '@modules/map-data/interfaces';
import { MapDataService } from '@modules/map-data/services/map-data.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { latLng, LatLngBounds, Map, tileLayer } from 'leaflet';
import { PanelModule } from 'primeng/panel';
import { SelectItem } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { environment } from '@environments/environment';
import { forkJoin, Subscription } from 'rxjs';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { NotificationSocket } from '@shared/services/notification-socket.service';
import { MapUploadStatus, uploadMessages } from '@modules/map-data/constants';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { StyleService } from '@modules/map-data/services/style.service';
import { StyleParams } from '@modules/map-data/interfaces/style/style.params';
import { Style } from '@modules/map-data/interfaces/style/style.interface';
import { CheckboxModule } from 'primeng/checkbox';
import { PermissionDirective } from '@shared/directives';
import { ResourceTypes } from '@shared/constants';
import { StylesFormComponent } from '@modules/map-data/pages/styles-page/components/styles-form/styles-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
	selector: 'app-map-data-form',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		PermissionDirective,
		LoaderComponent,
		InputErrorComponent,
		InputTextComponent,
		LeafletModule,
		CheckboxModule,
		FileUploadModule,
		DatePickerModule,
		PanelModule,
		SelectModule,
		MultiSelectModule,
		StepperModule,
		ButtonModule,
		AutoCompleteModule,
	],
	templateUrl: './map-data-form.component.html',
	styleUrl: './map-data-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapDataFormComponent extends BaseFormComponent<MapData> {
	public currentStep = model(1);
	public uploadStatus = model(MapUploadStatus.PENDING);
	public uploadMessage = computed(() => {
		return uploadMessages[this.uploadStatus()];
	});
	public showUpload = computed(() =>
		[MapUploadStatus.FAILED, MapUploadStatus.PENDING, MapUploadStatus.COMPLETED].includes(this.uploadStatus()),
	);
	private clearCacheNumber = 0;

	override _service = inject(MapDataService);
	private _styleService = inject(StyleService);

	public geomTypes: SelectItem[] = [
		{ label: 'Punto', value: 'Point' },
		{ label: 'Línea', value: 'LineString' },
		{ label: 'Polígono', value: 'Polygon' },
		{ value: 'Raster', label: 'Raster' },
	];

	public mapOptions = {
		layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })],
		zoom: 5,
		center: latLng(-16.889, -65.567),
	};
	public mapLayer = tileLayer('');
	private _map?: Map;

	private maximize$?: Subscription;

	private socket = inject(NotificationSocket);

	public styles: Style[] = [];
	public selectedStyle = model<Style | undefined>();

	override ngOnDestroy(): void {
		if (this.currentItem()?.uuid) this.socket.removeListener(this.currentItem().uuid);
		this.maximize$?.unsubscribe();
		this._ref.close();
	}

	public onMapReady(map: Map): void {
		this._map = map;
		if (this.maximize$) this.maximize$.unsubscribe();
		this.maximize$ = this._ref.onMaximize.subscribe(() => {
			map.invalidateSize();
		});

		if (this.currentItem().bbox || this.currentItem().bboxImage) this.loadMapData();
	}

	override buildForm(): void {
		this.isLoading.set(true);

		forkJoin([this._styleService.getAll(new StyleParams().setShowAll(true))]).subscribe({
			next: ([styles]) => {
				this.styles = styles.items;

				const contentDate = this.currentItem().contentDate ? new Date(this.currentItem().contentDate) : new Date();

				this._form = this._fb.group({
					name: [this.currentItem().name, [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
					typeGeom: [
						this.currentItem().typeGeom,
						[Validators.required, Validators.maxLength(100), Validators.minLength(3)],
					],
					description: [this.currentItem().description, [Validators.maxLength(300), Validators.minLength(3)]],
					updateFrequency: [this.currentItem().updateFrequency, [Validators.maxLength(100), Validators.minLength(3)]],
					contentDate: [contentDate, [Validators.required]],
					isPublic: [this.currentItem().isPublic ?? true],
					allowDownload: [this.currentItem().allowDownload ?? false],
					idStyle: [this.currentItem().idStyle],
				});

				const style = this.styles.find((s) => s.id === this.currentItem().idStyle);
				this.selectedStyle.set(style);
				this.isLoading.set(false);

				if (this.isViewMode()) this._form.disable();
			},
			error: () => {
				this._ts.error('Error al cargar los datos del mapa');
				this._ref.close();
			},
		});
	}

	public saveForm(): void {
		if (this._form.invalid) return;

		const data = this._form.value;

		this._form.disable();
		this.isLoading.set(true);

		const service = this.currentItem().id
			? this._service.update(this.currentItem().id, data)
			: this._service.create(data);

		service.subscribe({
			next: (res) => {
				this.currentItem.set(res);
				this.isLoading.set(false);
				this.socket.on(this.currentItem().uuid, (data: { mapCode: string; progress: MapUploadStatus }) => {
					this.progressHandler(data);
				});
				this._form.enable();
				this.currentStep.set(2);
			},
			error: (_err) => {
				this.isLoading.set(false);
				this._ts.error('Error al guardar los datos del mapa');
				this._form.enable();
			},
		});
	}

	private loadStyles() {
		return this._styleService.getAll(new StyleParams().setShowAll(true)).subscribe({
			next: (res) => {
				this.styles = res.items;
			},
		});
	}

	public onStyleChange() {
		this.loadMapData();
	}

	private progressHandler(data: { mapCode: string; progress: MapUploadStatus }) {
		this.uploadStatus.set(data.progress);
		if (data.progress === MapUploadStatus.COMPLETED) {
			this._ts.success('Mapa subido correctamente');
			this._service.getById(this.currentItem().id).subscribe({
				next: (res) => {
					this.currentItem.set(res);
					this.loadMapData();
				},
			});
		} else if (data.progress === MapUploadStatus.FAILED) {
			this._ts.error('Error al procesar el mapa');
		}
	}

	public uploadHandler(event: FileUploadHandlerEvent) {
		const formData = new FormData();
		formData.append('file', event.files[0]);
		formData.append('uuid', this.currentItem().uuid);

		this.uploadStatus.set(MapUploadStatus.UPLOADING);

		this._service.uploadFile(formData).subscribe({
			error: (_err) => {
				this._ts.error('Error al subir el archivo');
			},
		});
	}

	private loadMapData(): void {
		const geoserverUrl = environment.urlGeoserver.endsWith('/')
			? environment.urlGeoserver.slice(0, -1)
			: environment.urlGeoserver;
		const url = `${geoserverUrl}/${environment.workspaceGeoserver}/wms`;

		let bbox: any = null;
		let layer: string = '';

		if (this.currentItem().typeGeom == 'Raster') {
			delete this.currentItem().bboxImage.crs;
			const { bboxImage } = this.currentItem();
			bbox = new LatLngBounds([bboxImage.miny, bboxImage.minx], [bboxImage.maxy, bboxImage.maxx]);
			layer = `${environment.workspaceGeoserver}:a_${this.currentItem().nameImage?.replace(/-/g, '_')}`;
		} else {
			const { min_x, min_y, max_x, max_y } = JSON.parse(this.currentItem().bbox);
			bbox = new LatLngBounds([min_y, min_x], [max_y, max_x]);
			layer = this.currentItem().layer;
		}

		const opts: any = {
			layers: `${layer}`,
			format: 'image/png',
			opacity: 1,
			transparent: true,
			version: '1.3.0',
			accessToken: `&${this.clearCacheNumber++}`,
		};

		if (this.selectedStyle()?.id) opts.styles = this.selectedStyle()!.name;

		this.mapLayer = tileLayer.wms(url, opts);

		this._cdr.detectChanges();

		this._map?.fitBounds(bbox, { padding: [50, 50] });
	}

	override onSubmit(): void {
		this.controls['idStyle'].setValue(this.selectedStyle()?.id);

		if (this.currentStep() === 1) {
			this.saveForm();
			return;
		}

		const data: MapData = this.form.value;
		const service = this._service.update(this.currentItem().id, data);

		service.subscribe({
			next: (res) => {
				this._ts.success('Mapa actualizado correctamente');
				this.isLoading.set(false);
				this._ref.close(res);
			},
			error: (_err) => {
				this.isLoading.set(false);
				this._ts.error('Error al guardar los datos del mapa');
			},
		});
	}

	public styleResource = ResourceTypes.CARTOGRAPHIC_STYLES;
	private _styleRef?: DynamicDialogRef;
	private _ds = inject(DialogService);

	public createStyle(): void {
		const modalConfig = {
			header: 'Crear estilo',
			modal: true,
			closable: true,
			maximizable: true,
			contentStyle: { overflow: 'auto' },
			width: '65vw',
			breakpoints: {
				'960px': '75vw',
				'640px': '90vw',
			},
		};

		this._styleRef = this._ds.open(StylesFormComponent, modalConfig);
		this._styleRef.onClose.subscribe((data: any) => {
			if (data) this.loadStyles();
			this._styleRef?.destroy();
			this._cdr.detectChanges();
		});
	}

	// INFO: RASTER
	public uploadedFiles: any[] = [];

	public myUploaderRaster(event: any) {
		this.uploadStatus.set(MapUploadStatus.UPLOADING);
		const formData = new FormData();
		for (let file of event.files) {
			formData.append('file', file);
			formData.append('id', this.currentItem().id + '');
		}
		this._service.saveRasterFile(formData).subscribe({
			next: (res: any) => {
				if (res.success) {
					this.uploadStatus.set(MapUploadStatus.COMPLETED);
					this._ts.success('Proceso finalizado correctamente');

					this._service.getById(this.currentItem().id).subscribe({
						next: (res) => {
							this.currentItem.set(res);
							this.loadMapData();
						},
					});
				}
			},
			error: (err: any) => {
				this.uploadStatus.set(MapUploadStatus.COMPLETED);
				let error = err.error && err.error.message ? err.error.message : err.error ? err.error + '' : 'Error';
				this._ts.error(error);
			},
		});
	}
}
