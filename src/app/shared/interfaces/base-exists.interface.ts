import { Observable } from 'rxjs';

export abstract class BaseExists {
	public abstract exists(field: string, value: string): Observable<boolean>;
}
