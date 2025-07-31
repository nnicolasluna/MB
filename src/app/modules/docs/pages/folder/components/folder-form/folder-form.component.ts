import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { folderService } from '@modules/docs/services/folder.service';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextComponent } from "@shared/components";
import { Button } from "primeng/button";

@Component({
  selector: 'app-folder-form',
  imports: [InputTextComponent, Button, ReactiveFormsModule],
  templateUrl: './folder-form.component.html',
  styleUrl: './folder-form.component.scss'
})
export class FolderFormComponent extends BaseFormComponent<any> {
  override _service = inject(folderService);
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
  override ngOnInit(): void {
    super.ngOnInit();

    const data = this.config.data;

    setTimeout(() => {
      if (data?.item) {
        const { ...resto } = data.item;

        this._form.patchValue({
          ...resto,
        });
      }
    });
  }
}
