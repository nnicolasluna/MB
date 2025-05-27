import { UserModel } from '@modules/users/interfaces';

export interface AccessTo {
	resource: string;
	code: string;
	permission: number;
}

export interface LoginResponse {
	user: UserModel;
	accessTo: { [key: string]: AccessTo };
	token: string;
}
