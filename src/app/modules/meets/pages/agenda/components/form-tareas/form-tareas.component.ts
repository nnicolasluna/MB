import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-form-tareas',
  imports: [
    FormsModule
  ],
  templateUrl: './form-tareas.component.html',
  styleUrl: './form-tareas.component.scss'
})
export class FormTareasComponent {
  nombre: string = '';
  apellido: string = '';

  constructor() { }

  ngOnInit(): void {
  }
}
