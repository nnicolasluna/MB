import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-calendar',
	imports: [CommonModule],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
	//@Input() data: any;
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

	data = [
		{
			Fecha: '15/02/2025',
			Objetivo: 'Revisar los avances del plan de reforestación en la zona norte.',
			ESTADO: 'EN PROGRESO',
			reunionExtraOrdinaria: false,
		},
		{
			Fecha: '15/02/2025',
			Objetivo: 'Discutir estrategias para la prevención de incendios forestales.',
			ESTADO: 'EN PROGRESO',
			reunionExtraOrdinaria: false,
		},
		{
			Fecha: '10/06/2025',
			Objetivo: 'Evaluar el impacto de las nuevas regulaciones ambientales.',
			ESTADO: 'PENDIENTE',
			reunionExtraOrdinaria: false,
		},
		{
			Fecha: '05/08/2025',
			Objetivo: 'Presentar informe sobre la calidad del agua en reservas naturales.',
			ESTADO: 'REALIZADO',
			reunionExtraOrdinaria: true,
		},
		{
			Fecha: '20/09/2025',
			Objetivo: 'Definir los lineamientos para la próxima campaña de concientización ambiental.',
			ESTADO: 'EN PROGRESO',
			reunionExtraOrdinaria: false,
		},
	];

	getReunionesPorMesYSemana(mesIndex: number, semanaIndex: number, esExtraordinaria: boolean) {
		return this.data.filter((reunion) => {
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
