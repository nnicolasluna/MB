import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { firstValueFrom } from 'rxjs';
import { ActivityService } from '@modules/meets/services/activity.service';

registerLocaleData(localeEs);

interface GanttTask {
	id: number;
	name: string;
	startDate: Date;
	endDate: Date;
	progress: number;
	acta: string;
	nameResposable?: string;
	lastNameResponsable?: string;
	participantes?: string[];
	listParty?: string;
}
@Component({
	selector: 'app-calendar-gantt',
	imports: [CommonModule, TooltipModule],
	templateUrl: './calendar-gantt.component.html',
	styleUrl: './calendar-gantt.component.scss',
	providers: [{ provide: LOCALE_ID, useValue: 'es' }],
})
export class CalendarGanttComponent implements OnInit {
	_service = inject(ActivityService);
	datoGrupo: any;
	tasks: GanttTask[] = [];
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
	timeScale: Date[] = [];
	projectStartDate: Date = new Date();
	projectEndDate: Date = new Date();
	_ref = inject(DynamicDialogRef);
	constructor(public config: DynamicDialogConfig) {
		this.datoGrupo = this.config.data;
		this.tasks = this.mapToGanttTasks(this.datoGrupo.data);
		console.log(this.tasks);
	}
	ngOnInit() {
		this.calculateTimeScale();
		this.datoGrupo = this.config.data;
	}

	calculateTimeScale() {
		const startDates = this.tasks.map((task) => task.startDate);
		const endDates = this.tasks.map((task) => task.endDate);

		this.projectStartDate = new Date(Math.min(...startDates.map((d) => d.getTime())));
		this.projectEndDate = new Date(Math.max(...endDates.map((d) => d.getTime())));

		this.timeScale = [];
		const current = new Date(this.projectStartDate.getFullYear(), this.projectStartDate.getMonth(), 1);
		const end = new Date(this.projectEndDate.getFullYear(), this.projectEndDate.getMonth(), 1);

		while (current <= end) {
			this.timeScale.push(new Date(current));
			current.setMonth(current.getMonth() + 1);
		}
	}

	getTaskPosition(task: GanttTask) {
		const totalMonths = this.timeScale.length;
		const monthWidth = 100 / totalMonths;

		const startMonthIndex = this.timeScale.findIndex(
			(date) => date.getFullYear() === task.startDate.getFullYear() && date.getMonth() === task.startDate.getMonth()
		);

		const endMonthIndex = this.timeScale.findIndex(
			(date) => date.getFullYear() === task.endDate.getFullYear() && date.getMonth() === task.endDate.getMonth()
		);

		const durationInMonths = endMonthIndex - startMonthIndex + 1;

		return {
			left: startMonthIndex * monthWidth,
			width: durationInMonths * monthWidth,
		};
	}

	formatDate(date: Date): string {
		return date.toLocaleDateString('es-ES', {
			day: '2-digit',
			month: '2-digit',
		});
	}

	isWeekend(date: Date): boolean {
		const day = date.getDay();
		return day === 0 || day === 6;
	}

	getDayOfWeek(date: Date): string {
		const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
		const meses = [
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
		return days[date.getDay()];
	}

	updateProgress(taskId: number, newProgress: number) {
		const task = this.tasks.find((t) => t.id === taskId);
		if (task) {
			task.progress = Math.max(0, Math.min(100, newProgress));
		}
	}
	getUniqueMonths(): Date[] {
		const unique: Date[] = [];
		const seen = new Set<string>();

		for (const date of this.timeScale) {
			const key = `${date.getFullYear()}-${date.getMonth()}`;
			if (!seen.has(key)) {
				seen.add(key);
				unique.push(date);
			}
		}

		return unique;
	}
	getEstadoClase(task: GanttTask): string {
		const hoy = new Date();
		const tresMesesEnMs = 3 * 30 * 24 * 60 * 60 * 1000;

		/* if (!task.acta || task.acta.trim() === '') {
      return 'estado-realizado';
    } */
		const isEmpty = !task.acta || task.acta.trim() === '';
		const endTime = task.endDate.getTime();
		const nowTime = hoy.getTime();
		if (!isEmpty) {
			return 'estado-realizado';
		} else if (endTime < nowTime) {
			return 'estado-sinrealizar';
		} else if (endTime - nowTime <= tresMesesEnMs) {
			return 'estado-norealizado';
		} else {
			return 'estado-porrealizar';
		}
	}
	mapToGanttTasks(actividad: any): GanttTask[] {
		if (!actividad || !Array.isArray(actividad.Tarea)) {
			console.warn('Actividad o Tarea no definida');
			return [];
		}
		const participantes = (actividad.grupo?.TareaUsuario || []).map((tu: any) => {
			const u = tu.usuario;
			return `${u.name} ${u.firstSurname} ${u.secondSurname}`;
		});
		return actividad.Tarea.map((tarea: any) => {
			const fechas = tarea.FechaProgramada.map((f: any) => {
				const fecha = new Date(f.fechaHora);
				return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
			}).sort((a: any, b: any) => a.getTime() - b.getTime());

			const startDate = fechas[0];
			const endDate = fechas[fechas.length - 1];

			return {
				id: tarea.id,
				name: tarea.nombre,
				startDate: startDate,
				endDate: endDate,
				progress: 0,
				acta: tarea.acta,
				nameResposable: tarea.usuario.name + '' + tarea.usuario.firstSurname + '' + tarea.usuario.secondSurname,
				participantes,
				original: tarea,
				listParty: tarea.listParty,
			};
		});
	}
	selectedTaskId: number | null = null;

	toggleTaskDetails(taskId: number) {
		this.selectedTaskId = this.selectedTaskId === taskId ? null : taskId;
	}
	expandedKey: string | null = null;
	file: File | null = null;
	generatedFileName: string = '';
	async onFileSelected(event: any, tipo: string) {
		this.file = event.target.files[0];
		if (this.file) {
			const ext = this.file.name.split('.').pop();
			const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
			this.generatedFileName = `doc_${timestamp}.${ext}`;
		}
		if (this.file) {
			if (this.file.type === 'application/pdf') {
				console.log('Archivo PDF seleccionado:', this.file.name);
				await this.uploadFile(tipo);
			} else {
				alert('Por favor, selecciona un archivo PDF válido.');
			}
		}
	}
	async uploadFile(tipo: string): Promise<void> {
		if (!this.file || !this.generatedFileName) throw new Error('Archivo no válido');

		const renamedFile = new File([this.file], this.generatedFileName, {
			type: this.file.type,
		});

		const formData = new FormData();
		formData.append('file', renamedFile);
		try {
			if (tipo == 'acta') {
				const response = await firstValueFrom(this._service.uploadFile(formData));
				await firstValueFrom(this._service.updateActa(this.selectedReunion!.id, { acta: this.generatedFileName }));
				this.closeForm();
				window.location.reload();
			} else {
				const response = await firstValueFrom(this._service.uploadFile(formData));
				await firstValueFrom(this._service.updateList(this.selectedReunion!.id, { acta: this.generatedFileName }));
				this.closeForm();
				window.location.reload();
			}
		} catch {}
	}
	selectedReunion: any | null = null;

	selectReunion(task: any) {
		this.selectedReunion = task;
	}
	public closeForm() {
		this._ref.close();
	}
	downloadFile = async (filename: string, tipo: string) => {
		try {
			if (tipo == 'acta') {
				const token = localStorage.getItem('token')!;
				const response = await firstValueFrom(this._service.downloadFile(filename, token));
				const url = window.URL.createObjectURL(response);
				const a = document.createElement('a');
				a.href = url;
				a.download = filename;
				a.click();
				window.URL.revokeObjectURL(url);
			} else {
				const token = localStorage.getItem('token')!;
				const response = await firstValueFrom(this._service.downloadFileList(filename, token));
				const url = window.URL.createObjectURL(response);
				const a = document.createElement('a');
				a.href = url;
				a.download = filename;
				a.click();
				window.URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error('Error al descargar:', error);
		}
	};
}
