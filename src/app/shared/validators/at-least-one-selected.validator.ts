import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function atLeastOneSelectedValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value as number[];
		return value && value.length > 0 ? null : { atLeastOneRequired: true };
	};
}
