export const rexPatternMessages: Record<string, string> = {
	'/^[a-zA-Z0-9_ñÑ]+$/': 'Solo se permiten letras, números y guiones bajos',
	'/[a-z]/': 'Debe contener al menos una letra minúscula',
	'/[A-Z]/': 'Debe contener al menos una letra mayúscula',
	'/\\d/': 'Debe contener al menos un número',
	'/\\W|_/': 'Debe contener al menos un símbolo',
};
