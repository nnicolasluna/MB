import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';
import { SessionModel } from '../interfaces/session.interface';

@Injectable({
	providedIn: 'root',
})
export class SessionService extends BaseExistsService<SessionModel> {
	constructor() {
		super('session');
	}

	
}
