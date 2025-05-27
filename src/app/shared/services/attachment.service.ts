import { Injectable } from '@angular/core';
import { IAttachment } from '../interfaces';
import { BaseHttpService } from './base-http.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AttachmentService extends BaseHttpService {
	constructor() {
		super('attachments');
	}

	upload(data: FormData): Observable<IAttachment[]> {
		return this.http.post<IAttachment[]>(`${this.namespace}/upload`, data);
	}

	getFileUrl(key?: string, download?: boolean) {
		if (!key) return '#';
		const url = `${this.namespace}/${key}`;

		if (download) return `${url}?download=${download}`;

		return url;
	}

	download(attachment: IAttachment) {
		const a = document.createElement('a');
		a.href = this.getFileUrl(attachment.uuid, true);
		a.download = attachment.filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
}
