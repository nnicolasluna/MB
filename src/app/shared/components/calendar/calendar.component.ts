import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from 'primeng/ts-helpers';
interface Reunion {
	Fecha: string;
	Objetivo: string;
	ESTADO: string;
	reunionExtraOrdinaria: boolean;
	acta: string;
}
@Component({
	selector: 'app-calendar',
	imports: [CommonModule],
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

	/* getReunionesPorMesYSemana(mesIndex: number, semanaIndex: number, esExtraordinaria: boolean) {
		return this.data.filter((reunion: Reunion) => {
			const partesFecha = reunion.Fecha.split('/');
			const dia = parseInt(partesFecha[0], 10);
			const mes = parseInt(partesFecha[1], 10) - 1;

			const semanaRangos = [
				[1, 7],
				[8, 14],
				[15, 21],
				[22, 31],
			];
			const [inicio, fin] = semanaRangos[semanaIndex];

			return mes === mesIndex && reunion.reunionExtraOrdinaria === esExtraordinaria && dia >= inicio && dia <= fin;
		});
	} */
	/* getReunionesPorMes(mesIndex: number, esExtraordinaria: boolean) {
		return this.data.filter((reunion: Reunion) => {
			const partesFecha = reunion.Fecha.split('/');
			const mes = parseInt(partesFecha[1], 10) - 1;
			console.log(mes)
			return mes === mesIndex && reunion.reunionExtraOrdinaria === esExtraordinaria;
		});
	} */
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
		const diffMeses = (fechaReunion.getFullYear() - fechaActual.getFullYear()) * 12 +
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

	toggleExpand(key: string): void {
		this.expandedKey = this.expandedKey === key ? null : key;
	}
	onFileSelected(event: any) {
		const file: File = event.target.files[0]; // Obtiene el primer archivo seleccionado

		if (file) {
			if (file.type === 'application/pdf') {
				console.log('Archivo PDF seleccionado:', file.name);
				// Aquí puedes realizar las siguientes acciones:
				// 1. Mostrar el nombre del archivo al usuario.
				// 2. Subir el archivo a un servidor (usando HttpClient).
				// 3. Leer el contenido del archivo si es necesario (FileReader).

				// Ejemplo: Actualizar la propiedad 'acta' de 'reunion' (si es que la necesitas para algo visual)
				// O podrías asignar el archivo directamente o su URL/nombre
			} else {
				alert('Por favor, selecciona un archivo PDF válido.');
				// O limpia el input si quieres que el usuario intente de nuevo
				// event.target.value = null;
			}
		}
	}
}
