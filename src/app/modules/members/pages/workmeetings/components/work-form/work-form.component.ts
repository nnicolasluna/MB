import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkService } from '@modules/members/services/work.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
	selector: 'app-work-form',
	imports: [InputTextComponent, ReactiveFormsModule, SelectModule, InputErrorComponent, ButtonModule, DatePickerModule],
	templateUrl: './work-form.component.html',
	styleUrl: './work-form.component.scss',
})
export class WorkFormComponent extends BaseFormComponent<any> {
	override _service = inject(WorkService);

	override buildForm(): void {
		this._form = this._fb.group({
			nombreReunion: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			fechaReunion: [, [Validators.required]],
			fechaSegundaReunion: [, [Validators.required]],
			grupoId: [,],
		});
	}
}
