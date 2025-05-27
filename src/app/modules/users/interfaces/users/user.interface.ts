import { IAttachment } from '@shared/interfaces';
import { Role } from '../';

export interface UserModel {
	id: number;
	uuid: string;
	username: string;
	email: string;
	name: string;
	firstSurname: string;
	secondSurname: string;
	ci: string;
	phone: string;
	userStatus: string;
	reviwedVerificationCode: boolean;
	expirationAccount: string;
	address: string;
	role: Role;
	image: IAttachment;
	fullName: string;
}
