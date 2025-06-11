import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
	selector: 'app-form-tareas',
	imports: [FormsModule, DatePickerModule, InputTextModule, SelectModule, MultiSelectModule],
	templateUrl: './form-tareas.component.html',
	styleUrl: './form-tareas.component.scss',
})
export class FormTareasComponent {
	nombre: string = '';
	apellido: string = '';

	constructor() { }

	ngOnInit(): void { }
}
