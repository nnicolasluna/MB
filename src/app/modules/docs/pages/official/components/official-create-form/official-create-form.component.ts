import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { DocsService } from '@modules/docs/services/docs.service';
import { UserModel } from '@modules/users/interfaces';
import { UserService } from '@modules/users/services/user.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';

@Component({
	selector: 'app-official-create-form',
	imports: [InputTextComponent, ReactiveFormsModule, SelectModule, InputErrorComponent, ButtonModule],
	templateUrl: './official-create-form.component.html',
	styleUrl: './official-create-form.component.scss',
})
export class OfficialCreateFormComponent extends BaseFormComponent<UserModel> {
	override _service = inject(DocsService);
	TypeActivity: any;
	override buildForm(): void {
		this._form = this._fb.group({
			titulo: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			visualizacion: ['', [Validators.required]],
		});
	}
	constructor(public config: DynamicDialogConfig) {
		super();
		this.TypeActivity = [
			{ name: 'Documento Interno', visualizacion: 'interno' },
			{ name: 'Documento Externo', visualizacion: 'externo' },
		];
	}
	override ngOnInit(): void {
		super.ngOnInit();

		const data = this.config.data;

		setTimeout(() => {
			if (data?.item) {
				const { fecha_crea, fecha_modifica, fecha_elimina, ...resto } = data.item;

				this._form.patchValue({
					...resto,
					visualizacion: data.item.tipoVizualizacion,

				});

				console.log('Formulario en modo visualización:', this._form.value);
			}
		});
	}
}
