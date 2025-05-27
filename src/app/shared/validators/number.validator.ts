import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numberValidator(): ValidatorFn {
	return (control: AbstractControl) => {
		const value = control.value;

		if (value === null || value === undefined || value === '') return null;

		if (isNaN(value)) return { number: true };

		return null;
	};
}
