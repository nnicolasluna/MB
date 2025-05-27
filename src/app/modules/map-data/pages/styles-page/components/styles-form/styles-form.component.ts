import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MapData, MapDataParams } from '@modules/map-data/interfaces';
import { Style } from '@modules/map-data/interfaces/style/style.interface';
import { MapDataService } from '@modules/map-data/services/map-data.service';
import { StyleService } from '@modules/map-data/services/style.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { checkIfExistsValidator } from '@shared/validators';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { StepperModule } from 'primeng/stepper';

@Component({
    selector: 'app-styles-form',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        LoaderComponent,
        InputErrorComponent,
        InputTextComponent,
        FileUploadModule,
        MultiSelectModule,
        StepperModule,
        ButtonModule,
    ],
    templateUrl: './styles-form.component.html',
    styleUrl: './styles-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StylesFormComponent extends BaseFormComponent<Style> {
	override _service = inject(StyleService);
	private _mapDataService = inject(MapDataService);

	public maps: MapData[] = [];

	public type: 'sld' | 'zip' = 'sld';

	override ngOnInit() {
		this.isLoading.set(true);
		this._mapDataService.getAll(new MapDataParams().setShowAll(true).setSortField('name')).subscribe({
			next: (maps) => {
				this.maps = maps.items;
				if (this.currentItem()?.id) {
					this._service.getById(this.currentItem().id).subscribe({
						next: (style) => {
							this.currentItem.set(style);
							this.buildForm();
						},
						error: () => {
							this._ts.error('Error al obtener el estilo');
							this._ref.close();
						},
					});
				} else {
					this.buildForm();
				}
			},
			error: () => {
				this._ts.error('Error al obtener las coverturas');
				this._ref.close();
			},
		});
	}

	override buildForm(): void {
		const maps = this.currentItem().maps?.map((map) => map.id) ?? [];

		this._form = this._fb.group({
			name: [this.currentItem().name, [Validators.required]],
			type: [this.currentItem().type ?? this.type, []],
			data: [this.currentItem().data, [Validators.required]],
			maps: [maps, []],
		});

		this.isLoading.set(false);

		if (this.isViewMode()) {
			this._form.disable();
		} else if (!this.currentItem()?.id) {
			this._form.get('name')?.setAsyncValidators([checkIfExistsValidator('name', this._service)]);
		}
	}

	public onSLDSelect(event: FileSelectEvent) {
		const file = event.currentFiles[0];
		if (!file) return;

		const content = new FileReader();
		content.readAsText(file);
		content.onload = () => {
			const data = content.result as string;
			this._form.get('data')?.setValue(data);
		};
	}
}
