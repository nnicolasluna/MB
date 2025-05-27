import { UserStatus } from '@modules/users/constants';
import { BaseParams } from '@shared/interfaces';

export class UserParams extends BaseParams {
	public userStatus: UserStatus = UserStatus.APROVE;
}
