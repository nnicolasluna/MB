import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '@shared/services';
import { BaseCRUDHttpService } from '@shared/services/base-crud-http.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    template: '',
    standalone: false
})
export abstract class BaseFormComponent<T> implements OnInit, OnDestroy {
	public isLoading = signal(false);

	public get form(): FormGroup {
		return this._form;
	}

	public get controls() {
		return this._form?.controls;
	}

	protected _cdr = inject(ChangeDetectorRef);
	protected _form!: FormGroup;
	protected _fb: FormBuilder = inject(FormBuilder);

	protected _ref = inject(DynamicDialogRef);
	protected _config = inject(DynamicDialogConfig);
	public isViewMode = signal(this._config?.data?.isViewMode ?? false);
	public currentItem = signal<T>(this._config?.data?.item ?? {});

	protected _ts = inject(ToastService);

	abstract _service: BaseCRUDHttpService<T>;

	public ngOnInit(): void {
		this.buildForm();

		if (this.isViewMode()) this._form.disable();
	}

	public ngOnDestroy(): void {
		this._ref.close();
	}

	abstract buildForm(): void;

	public onSubmit(): void {
		if (this._form.invalid || this.isViewMode()) return;

		this.isLoading.set(true);

		const item = this._form.value as T;

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
	}

	protected _isPartComplete(controlNames: string[]) {
		return controlNames.every((controlName) => this.controls[controlName].valid);
	}

	public closeForm() {
		this._ref.close();
	}
}
