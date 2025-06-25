import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { FormTareasComponent } from '../form-tareas/form-tareas.component';
import { FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { UserModel, UserParams } from '@modules/users/interfaces';
import { UserService } from '@modules/users/services/user.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseCRUDHttpService, ToastService } from '@shared/services';
import { GroupService } from '@modules/members/services/group.service';
import { AgendaService } from '@modules/meets/services/agenda.service';
import { ActivityService } from '@modules/meets/services/activity.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';

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
	ts = inject(ToastService);
	ref = inject(DynamicDialogRef);
	GroupService = inject(GroupService);
	//override _service = inject(UserService);
	override _service: BaseCRUDHttpService<any> = inject(AgendaService);
	constructor(private actividadService: ActivityService) {
		super();
		this.TypeActivity = [{ name: 'Ordinaria' }, { name: 'Extraordinaria' }];
	}
	override buildForm(): void {
		this._form = this._fb.group({
			actividad: ['', Validators.required],
			TipoActividad: ['', Validators.required],
			grupo: [null, Validators.required],
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
		this.datosTareas = this.formularios.map((f) => f.getDatos().value);
		const payload = {
			actividad: datosActividad,
			tareas: this.datosTareas,
		};
		/* console.log(payload); */
		if (this.datosTareas.length > 0 && this.ValidadorTareas[0]) {
			this.actividadService.create(payload).subscribe({
				next: (response) => {
					this.ts.success('Guardado con éxito');
					this.ref.close(payload);
					window.location.reload();
				},
				error: (error) => {
					console.error('Error al guardar actividad y tareas:', error);
					this.ts.error('Error al guardar');
				},
			});
		} else {
			const formulariosArray = this.formularios.toArray();
			formulariosArray.forEach((f) => f.marcarCamposComoTocados());
			this._form.markAllAsTouched();
			this.ts.error('Error al guardar');
		}
	}
	get formularioInvalido(): boolean {
		return this._form.invalid || this.ValidadorTareas.some((v) => !v);
	}
	public Groups = toSignal(
		this.GroupService.getAll(new UserParams().setShowAll(true).setSortField('name')).pipe(
			map((res) => res?.items ?? []),
			catchError(() => of([]))
		)
	);
}
