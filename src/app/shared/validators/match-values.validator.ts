import { FormGroup } from '@angular/forms';

export function matchValuesValidator(controlNames: string[]) {
	return (formGroup: FormGroup) => {
		const values = controlNames.map((name) => formGroup.controls[name].value);
		const uniqueValues = new Set(values);
		if (uniqueValues.size === 1) return null;

		return { mismatch: true };
	};
}
