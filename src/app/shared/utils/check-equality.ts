export function deepEqual(value1: any, value2: any): boolean {
	if (value1 === value2) return true;

	if (typeof value1 !== 'object' || value1 === null || typeof value2 !== 'object' || value2 === null) {
		return false;
	}

	const keys1 = Object.keys(value1);
	const keys2 = Object.keys(value2);

	if (keys1.length !== keys2.length) return false;

	for (const key of keys1) {
		if (!keys2.includes(key) || !deepEqual(value1[key], value2[key])) {
			return false;
		}
	}

	return true;
}

export function arraysDeepEqual<T>(arr1: T[], arr2: T[]): boolean {
	if (arr1 === arr2) return true;

	if (arr1.length !== arr2.length) return false;

	for (let i = 0; i < arr1.length; i++) {
		if (!deepEqual(arr1[i], arr2[i])) {
			return false;
		}
	}

	return true;
}
