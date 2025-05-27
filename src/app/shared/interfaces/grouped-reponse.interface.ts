export interface GroupListResponse<T> {
	groups: GroupResponse<T>[];
	total: number;
}

export interface GroupResponse<T> {
	group: string;
	items: T[];
}
