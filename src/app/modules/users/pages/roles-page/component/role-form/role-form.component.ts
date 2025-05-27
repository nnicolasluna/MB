import { ChangeDetectionStrategy, inject } from '@angular/core';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '@modules/users/interfaces';
import { RoleService } from '@modules/users/services/role.service';
import { InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { checkIfExistsValidator } from '@shared/validators';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

@Component({
	selector: 'app-role-form',
	imports: [ReactiveFormsModule, InputTextComponent, ButtonModule, TextareaModule],
	templateUrl: './role-form.component.html',
	styleUrl: './role-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFormComponent extends BaseFormComponent<Role> {
	override _service = inject(RoleService);

	override buildForm() {
		this._form = this._fb.group({
			name: [this.currentItem().name, [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
			description: [this.currentItem().description, [Validators.maxLength(300), Validators.minLength(3)]],
		});

		if (!this.currentItem()?.id) {
			this._form.get('name')?.setAsyncValidators([checkIfExistsValidator('name', this._service)]);
		}
	}
}
