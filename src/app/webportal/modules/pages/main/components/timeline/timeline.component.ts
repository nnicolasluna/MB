import { Component } from '@angular/core';
import { Timeline } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-timeline',
	imports: [Timeline, CardModule, ButtonModule, CommonModule],
	templateUrl: './timeline.component.html',
	styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
	events: any[];

	constructor() {
		this.events = [
			{
				status: '1ra reunion ',
				date: '2 octubre',
				content: [
					'Financiamiento climático y proyectos.',
					'Implementación de las NDC con énfasis en las metas de bosques.',
					'Desarrollo normativo.',
					'Estrategia de reducción de la deforestación e incendios.',
					'Monitoreo MRV relacionado con bosques y sistemas de vida.',
				],
				icon: 'assets/webportal/linea/hoja.png',
				color: '#11CA9D',
			},
			{
				status: '2da reunion ',
				date: '4 noviembre',
				content: [
					'Financiamiento climático y proyectos.',
					'Implementación de las NDC con énfasis en las metas de bosques.',
					'Desarrollo normativo.',
					'Estrategia de reducción de la deforestación e incendios.',
					'Monitoreo MRV relacionado con bosques y sistemas de vida.',
				],
				icon: 'assets/webportal/linea/segunda.png',
				color: '#FFDD28',
			},
			{
				status: '3ra reunion ',
				date: '15 diciembre',
				content: [
					'Financiamiento climático y proyectos.',
					'Implementación de las NDC con énfasis en las metas de bosques.',
					'Desarrollo normativo.',
					'Estrategia de reducción de la deforestación e incendios.',
					'Monitoreo MRV relacionado con bosques y sistemas de vida.',
				],
				icon: 'assets/webportal/linea/tercera.png',
				color: '#44C350',
			},
			{
				status: '4ta reunion',
				date: '25 diciembre',
				content: [
					'Financiamiento climático y proyectos.',
					'Implementación de las NDC con énfasis en las metas de bosques.',
					'Desarrollo normativo.',
					'Estrategia de reducción de la deforestación e incendios.',
					'Monitoreo MRV relacionado con bosques y sistemas de vida.',
				],
				icon: 'assets/webportal/linea/cuarto.png',
				color: '#FF9110',
			},
		];
	}
}
