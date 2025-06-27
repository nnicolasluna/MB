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
  selector: 'app-working-group-docs-form',
  imports: [InputTextComponent, ReactiveFormsModule, SelectModule, InputErrorComponent, ButtonModule, DatePickerModule],
  templateUrl: './working-group-docs-form.component.html',
  styleUrl: './working-group-docs-form.component.scss'
})
export class WorkingGroupDocsFormComponent extends BaseFormComponent<any> {

  override _service = inject(WorkService);
  id_group: any;
  constructor(public config: DynamicDialogConfig) {
    super();
    this.id_group = config.data?.id_group;
  }
  override buildForm(): void {
    this._form = this._fb.group({
      nombre: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],

      grupoId: [Number(this.id_group)],
    });
  }
}
