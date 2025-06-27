import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkingDocsService } from '@modules/docs/services/workingDocs.service';
import { WorkService } from '@modules/members/services/work.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'app-working-group-docs-form',
	imports: [InputTextComponent, ReactiveFormsModule, SelectModule, ButtonModule, DatePickerModule],
	templateUrl: './working-group-docs-form.component.html',
	styleUrl: './working-group-docs-form.component.scss',
})
export class WorkingGroupDocsFormComponent extends BaseFormComponent<any> {
	override _service = inject(WorkingDocsService);
	id_group: any;
	constructor(public config: DynamicDialogConfig) {
		super();
		this.id_group = config.data?.id_group;
	}
	override buildForm(): void {
		this._form = this._fb.group({
			nombre: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			descripcion: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],

			grupoId: [Number(this.id_group)],
		});
	}
	selectedFile: File | null = null;
	generatedFileName: string = '';

	onFileSelected(event: any) {
		this.selectedFile = event.target.files[0];
		if (this.selectedFile) {
			const ext = this.selectedFile.name.split('.').pop();
			const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
			this.generatedFileName = `doc_${timestamp}.${ext}`;
			this._form.patchValue({ nombreArchivo: this.generatedFileName });
		}
	}
	async uploadFile(): Promise<void> {
		if (!this.selectedFile || !this.generatedFileName) throw new Error('Archivo no válido');

		const renamedFile = new File([this.selectedFile], this.generatedFileName, {
			type: this.selectedFile.type,
		});

		const formData = new FormData();
		formData.append('file', renamedFile);

		const response = await firstValueFrom(this._service.uploadFile(formData));
		console.log('Archivo subido:', response);
	}
	override async onSubmit(): Promise<void> {
		if (this._form.invalid || this.isViewMode()) return;

		this.isLoading.set(true);

		try {
			if (this.selectedFile) {
				await this.uploadFile();
				this._form.patchValue({ nombreArchivo: this.generatedFileName });
			}

			const item = this._form.value;

			let call$ = (this.currentItem() as any)?.id
				? this._service.update((this.currentItem() as any)?.id, item)
				: this._service.create(item);

			call$.subscribe({
				next: () => {
					this._ts.success('Guardado con éxito');
					this.isLoading.set(false);
					this._ref.close(item);
				},
				error: () => {
					this._ts.error('Error al guardar');
					this.isLoading.set(false);
				},
			});
		} catch (error) {
			this._ts.error('Error al subir el archivo');
			this.isLoading.set(false);
			console.error(error);
		}
	}
}
