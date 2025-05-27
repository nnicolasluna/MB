import { Component, input, OnInit, output } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { IAttachment } from '@shared/interfaces';
import { AttachmentService } from '@shared/services/attachment.service';
import { FileSelectEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

export type UploadFilesEvent = { event: FileUploadEvent | FileSelectEvent; files: IAttachment[] };

@Component({
	selector: 'app-input-file',
	templateUrl: './input-file.component.html',
	styleUrls: ['./input-file.component.scss'],
	imports: [ImageModule, FileUploadModule, MessageModule, ProgressSpinnerModule],
})
export class InputFileComponent implements OnInit {
	id = input('');
	label = input('Seleccionar');
	accept = input('');
	multiple = input(false);
	maxFiles = input(0);
	isDragDrop = input(false);
	disabled = input(false);
	preview = input(true);
	defaultFiles = input<IAttachment[] | undefined>(undefined);
	maxFileSize = input(100000000);
	onSelect = output<any>();
	onUploaded = output<UploadFilesEvent>();
	onRemove = output<any>();

	errorMessage: string = '';
	files: File[] = [];
	isUploading: boolean = false;
	uploaded: boolean = false;

	constructor(public readonly service: AttachmentService) {}

	ngOnInit(): void {
		if (this.defaultFiles()?.length) {
			this.defaultFiles()?.map((attachment) => {
				let emptyData = new Blob([''], { type: attachment.contentType });
				let arrayOfBlob = new Array<Blob>();
				arrayOfBlob.push(emptyData);
				let file: File = new File(arrayOfBlob, attachment.filename);
				this.files.push(file);
			});
		}
	}

	onChange(event: FileUploadEvent | FileSelectEvent) {
		const total = this.files.length + event.files.length;
		if (this.maxFiles() > 0 && total > this.maxFiles()) {
			this.errorMessage = '*El valor máximo de archivos es ' + this.maxFiles();
			return;
		}

		this.isUploading = true;
		this.uploaded = false;
		this.files.push(...event.files);
		this.onSelect.emit(event.files);
		let formData = new FormData();
		for (const file of event.files) {
			formData.append('files[]', file, file.name);
		}

		this.service.upload(formData).subscribe({
			next: (response) => {
				this.onUploaded.emit({ event, files: response });
				this.isUploading = false;
				this.uploaded = true;
			},
			error: (err) => {
				this.isUploading = false;
				this.uploaded = false;
				console.error(err);
			},
		});
	}

	remove(event: any) {
		this.files.splice(this.files.indexOf(event), 1);
		if (this.files.length <= this.maxFiles()) this.errorMessage = '';
		this.onRemove.emit(this.files);
	}

	fileIcon(type: string): string {
		if (type === 'application/pdf') return 'pi pi-file-pdf';
		if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'pi pi-file-excel';
		if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'pi pi-file-word';
		if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'pi pi-file';
		if (type.includes('image/')) return 'pi pi-image';
		return 'pi pi-file';
	}

	isImage(type: string) {
		return type.includes('image/');
	}
}
