import { UserModel } from '../users/user.interface';

export interface LogActivity {
	id: number;
	name: string;
	description: string;
	method: string;
	url: string;
	ip: string;
	idUser: number;
	date: Date;
	user: UserModel;
}
