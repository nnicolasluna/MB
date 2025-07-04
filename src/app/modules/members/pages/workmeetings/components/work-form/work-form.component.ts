import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkService } from '@modules/members/services/work.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';

@Component({
	selector: 'app-work-form',
	imports: [InputTextComponent, ReactiveFormsModule, SelectModule, InputErrorComponent, ButtonModule, DatePickerModule,CommonModule],
	templateUrl: './work-form.component.html',
	styleUrl: './work-form.component.scss',
})
export class WorkFormComponent extends BaseFormComponent<any> {
	TypeActivity: any;
	override _service = inject(WorkService);
	id_group: any;
	constructor(public config: DynamicDialogConfig) {
		super();
		this.TypeActivity = [{ name: 'Virtual' }, { name: 'Presencial' }];
		this.id_group = config.data?.id_group;
	}
	override buildForm(): void {
		this._form = this._fb.group({
			nombreReunion: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			fechaReunion: [, [Validators.required]],
			fechaSegundaReunion: [, [Validators.required]],
			grupoId: [Number(this.id_group)],
			link: [],
			direccion:[],
			modalidad: [null, [Validators.required]],
		});
	}
	override ngOnInit(): void {
		super.ngOnInit();

		const data = this.config.data;

		setTimeout(() => {
			if (data?.item) {
				const { fechaReunion, fechaSegundaReunion, ...resto } = data.item;

				this._form.patchValue({
					...resto,
					fechaReunion: new Date(fechaReunion),
					fechaSegundaReunion: new Date(fechaSegundaReunion),
				});
			}
		});
	}
}
