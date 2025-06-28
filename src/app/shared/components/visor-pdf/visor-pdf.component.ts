import { Component, Input } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
	selector: 'app-visor-pdf',
	imports: [PdfViewerModule],
	templateUrl: './visor-pdf.component.html',
	styleUrl: './visor-pdf.component.scss',
})
export class VisorPdfComponent {
	@Input() pdfSrc: string = '';
	page = 1;
	totalPages = 0;
	isLoaded = false;

	nextPage() {
		if (this.page < this.totalPages) this.page++;
	}

	prevPage() {
		if (this.page > 1) this.page--;
	}

	onLoadComplete(pdf: any) {
		this.totalPages = pdf.numPages;
		this.isLoaded = true;
	}
}
