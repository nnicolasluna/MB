import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { DocsService } from '@modules/docs/services/docs.service';
import { UserModel } from '@modules/users/interfaces';
import { UserService } from '@modules/users/services/user.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
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
	constructor() {
		super();
		this.TypeActivity = [
			{ name: 'Documento Interno', visualizacion: 'interno' },
			{ name: 'Documento Externo', visualizacion: 'externo' },
		];
	}
}
