import { Component } from '@angular/core';
import { FormTareasComponent } from '../form-tareas/form-tareas.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextComponent } from '@shared/components';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-actividades',
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    FormTareasComponent,
    InputTextComponent
  ],
  templateUrl: './form-actividades.component.html',
  styleUrl: './form-actividades.component.scss'
})
export class FormActividadesComponent {
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

}
