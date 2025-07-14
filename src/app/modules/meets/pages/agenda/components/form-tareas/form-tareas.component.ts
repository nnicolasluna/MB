import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserService } from '@modules/users/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserModel, UserParams } from '@modules/users/interfaces';
import { map, catchError, of, pipe } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { InputErrorComponent, InputTextComponent } from '@shared/components';

@Component({
	selector: 'app-form-tareas',
	imports: [
		InputTextComponent,
		InputErrorComponent,
		FormsModule,
		DatePickerModule,
		InputTextModule,
		SelectModule,
		MultiSelectModule,
		CommonModule,
		ReactiveFormsModule,
	],
	templateUrl: './form-tareas.component.html',
	styleUrl: './form-tareas.component.scss',
})
export class FormTareasComponent {
	_service = inject(UserService);
	_form!: FormGroup;
	_fb = inject(FormBuilder);
	constructor() {
		this.buildForm();
	}
	buildForm(): void {
		this._form = this._fb.group({
			tarea: ['', Validators.required],
			fechas: [[], Validators.required],
			resultado: ['', Validators.required],
			responsable: [null, Validators.required],
		});
	}
	getDatos() {
		return this._form;
	}
	private _userService = inject(UserService);
	public Users = toSignal(
		this._userService.getAll(new UserParams().setShowAll(true).setSortField('name')).pipe(
			map((res) => res?.items ?? []),
			catchError(() => of([]))
		)
	);
	get controls() {
		return this._form.controls;
	}
	marcarCamposComoTocados(): void {
		this._form.markAllAsTouched();
	}
	setDatos(tarea: any) {
		const intervalo = setInterval(() => {
			const usuarios = this.Users();
			if (!usuarios || usuarios.length === 0) {
				return;
			}

			const responsableObj = usuarios.find((u: any) => u.id === tarea.responsableId);

			this._form.patchValue({
				tarea: tarea.nombre,
				responsable: responsableObj ?? null,
				resultado: tarea.resultado,
				fechas: this.convertirFechas(tarea),
			});

			clearInterval(intervalo);
		}, 100);
	}


	convertirFechas(tarea: any): Date[] {
		if (!Array.isArray(tarea.FechaProgramada) || tarea.FechaProgramada.length === 0) {
			return [];
		}

		const fechasOrdenadas = tarea.FechaProgramada
			.map((f: any) => new Date(f.fechaHora))
			.sort((a: any, b: any) => a.getTime() - b.getTime());

		return fechasOrdenadas;
	}


}
