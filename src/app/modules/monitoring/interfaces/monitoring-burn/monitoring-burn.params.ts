import { BaseParams } from '@shared/interfaces';

export class MonitoringBurnParams extends BaseParams {
	coverageState?: string;

	setCoverageState(coverageState: string) {
		this.coverageState = coverageState;
		return this;
	}
}
