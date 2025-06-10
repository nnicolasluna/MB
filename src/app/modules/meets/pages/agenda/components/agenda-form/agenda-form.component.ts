import { Component, inject } from '@angular/core';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { AgendaModel } from '@modules/meets/interfaces/agenda.interface';
import { AgendaService } from '@modules/meets/services/agenda.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from '@shared/components';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-agenda-form',
  imports: [
    InputTextComponent,
    SelectModule,
    ButtonModule,
    DatePickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './agenda-form.component.html',
  styleUrl: './agenda-form.component.scss'
})
export class AgendaFormComponent extends BaseFormComponent<AgendaModel> {
  override _service = inject(AgendaService);
  override buildForm(): void {
    this._form = this._fb.group({
      name: [this.currentItem().name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      periodo: [this.currentItem().periodo, [Validators.required]],
    })
  }
}
