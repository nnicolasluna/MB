import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { FormTareasComponent } from '../form-tareas/form-tareas.component';
import { FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { UserModel } from '@modules/users/interfaces';
import { UserService } from '@modules/users/services/user.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';

@Component({
	selector: 'app-form-actividades',
	imports: [
		InputErrorComponent,
		ReactiveFormsModule,
		InputTextComponent,
		FormsModule,
		CommonModule,
		ButtonModule,
		FormTareasComponent,
		InputTextModule,
		SelectModule,
	],
	templateUrl: './form-actividades.component.html',
	styleUrl: './form-actividades.component.scss',
})
export class FormActividadesComponent extends BaseFormComponent<UserModel> {
	@ViewChildren(FormTareasComponent) formularios!: QueryList<FormTareasComponent>;
	TypeActivity: any;
	datosTareas: any[] = [];
	ValidadorTareas: any[] = [];
	formulariosNombres: any[] = [];
	override _service = inject(UserService);
	constructor(private cdr: ChangeDetectorRef) {
		super();
		this.TypeActivity = [{ name: 'Ordinaria' }, { name: 'Extraordinaria' }];
	}
	override buildForm(): void {
		this._form = this._fb.group({
			actividad: ['', Validators.required],
			TipoActividad: ['', Validators.required],
		});
	}
	agregarFormulario(): void {
		this.formulariosNombres.push({});
	}

	eliminarFormulario(index: number): void {
		this.formulariosNombres.splice(index, 1);
	}
	/* agregarFormulario(): void {
		this.formulariosNombres.push({ hidden: false });
	}

	ocultarFormulario(i: number): void {
		this.formulariosNombres[i].hidden = true;
	} */
	enviarDatos() {
		const datosActividad = this.form.value;
		this.ValidadorTareas = this.formularios.map((f) => f.getDatos().valid);
		this.cdr.detectChanges();
		this.datosTareas = this.formularios.map((f) => f.getDatos().value);
		const payload = {
			actividad: datosActividad,
			tareas: this.datosTareas,
		};
		console.log('Datos de la actividad2:', this.ValidadorTareas);
		console.log('Datos de la actividad1:', this.form.invalid);
		if (this.datosTareas.length > 0 && this.ValidadorTareas[0]) {
			console.log('Datos enviados:', payload);
		} else {
			const formulariosArray = this.formularios.toArray();
			formulariosArray.forEach((f) => f.marcarCamposComoTocados());
			this._form.markAllAsTouched();
		}
	}
	get formularioInvalido(): boolean {
		return this._form.invalid || this.ValidadorTareas.some((v) => !v);
	}
}
