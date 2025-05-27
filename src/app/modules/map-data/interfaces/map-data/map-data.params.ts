import { BaseParams } from '@shared/interfaces';

export class MapDataParams extends BaseParams {
	thematicId?: number;
	ids?: string;
	public setThematicId(thematicId: number) {
		this.thematicId = thematicId;
		return this;
	}
	public setIds(ids: string) {
		this.ids = ids;
		return this;
	}
}
