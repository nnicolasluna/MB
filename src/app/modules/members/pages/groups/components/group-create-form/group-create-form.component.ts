import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { UserModel } from '@modules/users/interfaces';
import { UserService } from '@modules/users/services/user.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
	selector: 'app-group-create-form',
	imports: [InputTextComponent, ReactiveFormsModule, SelectModule, InputErrorComponent, ButtonModule, DatePickerModule],
	templateUrl: './group-create-form.component.html',
	styleUrl: './group-create-form.component.scss',
})
export class GroupCreateFormComponent extends BaseFormComponent<UserModel> {
	override _service = inject(UserService);

	override buildForm(): void {
		this._form = this._fb.group({
			nombre: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			periodo: [, [Validators.required]],
		});
	}
}
