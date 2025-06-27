import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { DocsService } from '@modules/docs/services/docs.service';
import { SubDocsService } from '@modules/docs/services/Subdocs.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { IAttachment } from '@shared/interfaces';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'app-sub-category-create-form',
	imports: [InputTextComponent, ReactiveFormsModule, SelectModule, ButtonModule, FileUploadModule],
	templateUrl: './sub-category-create-form.component.html',
	styleUrl: './sub-category-create-form.component.scss',
})
export class SubCategoryCreateFormComponent extends BaseFormComponent<any> {
	id_acta: any;
	override _service = inject(SubDocsService);
	override buildForm(): void {
		this._form = this._fb.group({
			tituloSub: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			documentosId: [Number(this.id_acta)],
			nombreArchivo: [],
		});
	}
	constructor(public config: DynamicDialogConfig, private http: HttpClient) {
		super();
		this.id_acta = config.data?.id_acta;
	}
	override ngOnInit(): void {
		super.ngOnInit();

		const data = this.config.data;

		setTimeout(() => {
			if (data?.item) {
				const { ...resto } = data.item;

				this._form.patchValue({
					...resto,
				});
			}
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
