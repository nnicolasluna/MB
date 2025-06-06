import { Component, inject } from '@angular/core';
import { InputTextComponent } from '@shared/components';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { SessionModel } from '@modules/meets/interfaces/session.interface';
import { SessionService } from '@modules/meets/services/session.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-session-form',
  imports: [
    InputTextComponent,
    SelectModule,
    ButtonModule,
    DatePickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.scss'
})
export class SessionFormComponent extends BaseFormComponent<SessionModel> {
  override _service = inject(SessionService);
  override buildForm(): void {
    this._form = this._fb.group({
      objetivo: [this.currentItem(), [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      fecha: [this.currentItem(), Validators.required],
      tipo: [this.currentItem(), Validators.required],
    })
  }


}
