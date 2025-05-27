export function getNestedValue<T, U>(obj: T, path: string, defaultValue?: U): U {
	const keys = path.split('.');
	let result: any = obj;

	for (const key of keys) {
		if (result && key in result) {
			result = result[key];
		} else {
			return defaultValue as any;
		}
	}

	return result;
}
