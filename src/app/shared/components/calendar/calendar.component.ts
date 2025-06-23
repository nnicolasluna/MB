import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from 'primeng/ts-helpers';
interface Reunion {
	Fecha: string;
	Objetivo: string;
	ESTADO: string;
	reunionExtraOrdinaria: boolean;
}
@Component({
	selector: 'app-calendar',
	imports: [CommonModule],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
	@Input() data: Reunion[] = [];
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

	getReunionesPorMesYSemana(mesIndex: number, semanaIndex: number, esExtraordinaria: boolean) {
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
	}
}
