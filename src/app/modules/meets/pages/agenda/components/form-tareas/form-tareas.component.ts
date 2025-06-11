import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserService } from '@modules/users/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserParams } from '@modules/users/interfaces';
import { map, catchError, of, pipe } from 'rxjs';

@Component({
	selector: 'app-form-tareas',
	imports: [FormsModule, DatePickerModule, InputTextModule, SelectModule, MultiSelectModule],
	templateUrl: './form-tareas.component.html',
	styleUrl: './form-tareas.component.scss',
})
export class FormTareasComponent {
	private _userService = inject(UserService);
	public Users = toSignal(this._userService.getAll(new UserParams().setShowAll(true).setSortField('name'))
		.pipe(
			map(res => res?.items ?? [],
			),
			catchError(() => of([])),

		)
	)
}
