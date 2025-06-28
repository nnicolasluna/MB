import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from 'primeng/ts-helpers';
import { ActivityService } from '@modules/meets/services/activity.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '@shared/services';
import { DialogModule } from 'primeng/dialog';

interface Reunion {
	id: number;
	Fecha: string;
	Objetivo: string;
	ESTADO: string;
	reunionExtraOrdinaria: boolean;
	acta: string;
	grupo: string;
	responsableId: number;
	actividadId: number;
	resultado: string;
}
@Component({
	selector: 'app-calendar',
	imports: [CommonModule, DialogModule],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnChanges {
	@Input() data: Reunion[] = [];
	@Input() colorDinamico: string = 'black';
	@Input() ordinario: string = '#9747ff';
	@Input() extraordinario: string = '#b3b3b3';
	@Input() calendarioColor: string = '#eee';
	processedData: any[] = [];
	selectedReunion: Reunion | null = null;

	_service = inject(ActivityService);
	_ts = inject(ToastService);
	meses = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	semanas = Array(4);

	reunionesPorMes: Reunion[][] = Array.from({ length: 12 }, () => []);

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['data'] && this.data) {
			this.agruparReunionesPorMes();
		}
	}

	agruparReunionesPorMes(): void {
		this.reunionesPorMes = Array.from({ length: 12 }, () => []);

		this.data.forEach((item) => {
			const [day, month, year] = item.Fecha.split('/');
			const mesIndex = parseInt(month, 10) - 1;
			if (mesIndex >= 0 && mesIndex < 12) {
				this.reunionesPorMes[mesIndex].push(item);
			}
		});
	}
	getEstadoClase(reunion: Reunion): string {
		const actaVacia = !reunion.acta || reunion.acta.trim() === '';
		const [day, month, year] = reunion.Fecha.split('/');
		const fechaReunion = new Date(+year, +month - 1, +day);
		const fechaActual = new Date();

		// Calcular diferencia de meses
		const diffMeses =
			(fechaReunion.getFullYear() - fechaActual.getFullYear()) * 12 +
			(fechaReunion.getMonth() - fechaActual.getMonth());

		if (!actaVacia) {
			return 'estado-realizado';
		} else if (fechaReunion < fechaActual) {
			return 'estado-sinrealizar';
		} else if (diffMeses <= 3) {
			return 'estado-porrealizar';
		} else {
			return 'estado-norealizado';
		}
	}

	expandedKey: string | null = null;
	file: File | null = null;
	generatedFileName: string = '';

	toggleExpand(key: string): void {
		this.expandedKey = this.expandedKey === key ? null : key;
	}
	async onFileSelected(event: any) {
		this.file = event.target.files[0];
		if (this.file) {
			const ext = this.file.name.split('.').pop();
			const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
			this.generatedFileName = `doc_${timestamp}.${ext}`;
		}
		if (this.file) {
			if (this.file.type === 'application/pdf') {
				console.log('Archivo PDF seleccionado:', this.file.name);
				await this.uploadFile();
			} else {
				alert('Por favor, selecciona un archivo PDF válido.');
			}
		}
	}
	async uploadFile(): Promise<void> {
		if (!this.file || !this.generatedFileName) throw new Error('Archivo no válido');

		const renamedFile = new File([this.file], this.generatedFileName, {
			type: this.file.type,
		});

		const formData = new FormData();
		formData.append('file', renamedFile);
		try {
			const response = await firstValueFrom(this._service.uploadFile(formData));
			console.log('Archivo subido:', response);
			await firstValueFrom(this._service.update(this.selectedReunion!.id, { acta: this.generatedFileName }));
		} catch {}
	}
	selectReunion(reunion: Reunion): void {
		this.selectedReunion = reunion;
		console.log(this.selectedReunion);
	}
	mostrarDialogo = false;
	abrirModal() {
		console.log('abierto');
		this.mostrarDialogo = true;
	}
}
