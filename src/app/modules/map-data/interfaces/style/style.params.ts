import { BaseParams } from '@shared/interfaces';

export class StyleParams extends BaseParams {
	public mapDataCode = '';
	public setMapDataCode(mapDataCode: string) {
		this.mapDataCode = mapDataCode;
		return this;
	}
}
