import { ActionType } from '@shared/constants';

export interface ActionClickEvent {
	action: ActionType;
	data?: any;
}
