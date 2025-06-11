import { Component } from '@angular/core';
import { FormTareasComponent } from '../form-tareas/form-tareas.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
	selector: 'app-form-actividades',
	imports: [FormsModule, CommonModule, ButtonModule, FormTareasComponent, InputTextModule, SelectModule],
	templateUrl: './form-actividades.component.html',
	styleUrl: './form-actividades.component.scss',
})
export class FormActividadesComponent {
	TypeActivity: any;

	formulariosNombres: any[] = [];
	protected _form!: FormGroup;
	public get controls() {
		return this._form?.controls;
	}

	agregarFormulario(): void {
		this.formulariosNombres.push({});
	}

	eliminarFormulario(index: number): void {
		this.formulariosNombres.splice(index, 1);
	}
	ngOnInit() {
		this.TypeActivity = [
			{ name: 'Ordinaria' },
			{ name: 'Extraordinaria' }
		];
	}
}
