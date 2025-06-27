import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupModel } from '@modules/members/interfaces/user.interface';
import { GroupService } from '@modules/members/services/group.service';
import { UserModel, UserParams } from '@modules/users/interfaces';
import { UserService } from '@modules/users/services/user.service';
import { InputErrorComponent, InputTextComponent } from '@shared/components';
import { BaseFormComponent } from '@shared/components/abstracts/base-form.component';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { map, catchError, of, pipe } from 'rxjs';
@Component({
	selector: 'app-group-create-form',
	imports: [
		InputTextComponent,
		ReactiveFormsModule,
		SelectModule,
		InputErrorComponent,
		ButtonModule,
		DatePickerModule,
		MultiSelectModule,
	],
	templateUrl: './group-create-form.component.html',
	styleUrl: './group-create-form.component.scss',
})
export class GroupCreateFormComponent extends BaseFormComponent<GroupModel> {
	override _service = inject(GroupService);
	private _userService = inject(UserService);
	private config = inject(DynamicDialogConfig);

	override buildForm(): void {
		this._form = this._fb.group({
			nombre: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			periodo: [, [Validators.required]],
			participantes: [[]],
		});
	}

	public Users = toSignal(
		this._userService.getAll(new UserParams().setShowAll(true).setSortField('name')).pipe(
			map((res) => res?.items ?? []),
			catchError(() => of([]))
		)
	);
	/* override ngOnInit(): void {
		super.ngOnInit();
		const data = this.config.data;

		if (data?.item) {
			const { periodo_inicio, periodo_fin, ...resto } = data.item;

			this._form.patchValue({
				...resto,
				periodo: [periodo_inicio, periodo_fin],
			});

			console.log('Formulario en modo visualización:', this._form.value);
		}

	
	} */
	override ngOnInit(): void {
		super.ngOnInit();

		const data = this.config.data;

		setTimeout(() => {
			if (data?.item) {
				const { periodo_inicio, periodo_fin, ...resto } = data.item;
				const participantes = (data.item.TareaUsuario ?? []).map((tu: any) => tu.usuario.id);
				this._form.patchValue({
					...resto,
					periodo: [new Date(periodo_inicio), new Date(periodo_fin)],
					participantes,
				});

				console.log('Formulario en modo visualización:', this._form.value);
			}
			/* 
			this.isViewMode = data?.isViewMode ?? false; */
		});
	}

}
