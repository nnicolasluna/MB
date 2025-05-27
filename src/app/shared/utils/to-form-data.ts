export function toFormData(formValue: any) {
	const formData = new FormData();

	for (const key of Object.keys(formValue)) {
		if (formValue[key] === null || formValue[key] === undefined) continue;
		const value = formValue[key];
		formData.append(key, value);
	}

	return formData;
}
