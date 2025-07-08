import { Component, OnInit, inject, signal } from '@angular/core';
import { DocsService } from '@modules/docs/services/docs.service';
import { RoleParams, UserParams } from '@modules/users/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { CommonModule } from '@angular/common';
import { SubDocsService } from '@modules/docs/services/Subdocs.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DialogModule } from 'primeng/dialog';
import { firstValueFrom } from 'rxjs';
import { EventService } from '@modules/monitoring/services/events.service';
import { TableModule } from 'primeng/table';
import { BaseParams } from '@shared/interfaces';

@Component({
	selector: 'app-respositorio',
	imports: [CommonModule, PdfViewerModule, DialogModule, TableModule],
	templateUrl: './respositorio.component.html',
	styleUrl: './respositorio.component.scss',
})
export class RespositorioComponent implements OnInit {
	service: BaseCRUDHttpService<any> = inject(SubDocsService);
	documentosOficiales = signal<any[]>([]);
	tipoSeleccionado: 'oficiales' | 'grupo' = 'oficiales';
	visible: boolean = false;
	pdfSrc: string = '';
	_service = inject(SubDocsService);
	_serviceGrupos = inject(EventService);
	filters: BaseParams = new RoleParams();
	docs = signal<boolean>(true);
	ngOnInit(): void {
		this.seleccionarTipo('oficiales');
	}
	seleccionarTipo(tipo: 'oficiales' | 'grupo') {
		if (this.tipoSeleccionado === tipo && this.documentosOficiales?.length) return;

		this.tipoSeleccionado = tipo;

		if (tipo === 'oficiales') {
			this.docs.set(true);
			const filters = new UserParams();
			this.service.getAll(filters).subscribe({
				next: (data) => {
					this.documentosOficiales.set(
						(data.items || []).filter(
							(doc) => doc?.tituloSub && doc?.documentos?.titulo && doc?.fecha_crea && !!doc?.nombreArchivo
						)
					);
				},
				error: (err) => console.error('Error:', err),
			});
		}

		if (tipo === 'grupo') {
			this.docs.set(false);
			this._serviceGrupos.fechas(this.filters).subscribe({
				next: (data) => {
					this.documentosOficiales.set(
						(data.items || []).filter((doc: any) => doc?.nombre && doc?.Actividad?.nombre && !!doc?.acta)
					);
				},
				error: (err) => console.error('Error:', err),
			});
		}
	}

	async showDialog(item: any) {
		this.visible = true;
		try {
			if (item.acta) {
				const blob = await firstValueFrom(this._serviceGrupos.downloadexterno(item.acta));
				this.pdfSrc = URL.createObjectURL(blob);
			} else {
				const blob = await firstValueFrom(this._service.downloadFileExterno(item.nombreArchivo));
				this.pdfSrc = URL.createObjectURL(blob);
			}
		} catch (error) {
			console.error('Error al cargar el PDF:', error);
		}
	}
}
