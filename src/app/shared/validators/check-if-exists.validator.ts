import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { BaseExistsService } from '@shared/services';
import { of, startWith, debounceTime, switchMap, map, catchError } from 'rxjs';

export function checkIfExistsValidator<T>(field: string, service: BaseExistsService<T>): AsyncValidatorFn {
	return (control: AbstractControl) => {
		const value = control.value;
		if (!value) return of(null);

		return of(value).pipe(
			startWith(value),
			debounceTime(300),
			switchMap((value: string) => service.exists(field, value)),
			map((exists) => (exists ? { exists: true } : null)),
			catchError(() => of(null)),
		);
	};
}
