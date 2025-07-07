import { Component, inject, ViewChild } from '@angular/core';
import { Stepper, StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { GroupService } from '@modules/members/services/group.service';
import { BaseCRUDHttpService } from '@shared/services';
import { UserParams } from '@modules/users/interfaces';
@Component({
	selector: 'app-coordinacion',
	imports: [StepperModule, ButtonModule, CardModule, CommonModule],
	templateUrl: './coordinacion.component.html',
	styleUrl: './coordinacion.component.scss',
})
export class CoordinacionComponent {
	service: BaseCRUDHttpService<any> = inject(GroupService);
	grupoSeleccionado: any;
	@ViewChild('stepper') stepper!: Stepper;

	currentStep = 1;
	autoridades = [
		{
			nombre: 'Fondo Nacional de Desarrollo Forestal',
			sigla: 'assets/sistema/fonab.png',
			cargo: 'Director General Ejecutivo',
			persona: 'Delfín Reque Zurita',
		},
		{
			nombre: 'Dirección General de Gestión y Desarrollo Forestal',
			sigla: 'assets/sistema/dgf.jpg',
			cargo: 'Director General de Gestión y Desarrollo Forestal',
			persona: 'Filomon Hinojosa Torrico',
		},
		{
			nombre: 'Autoridad de Fiscalización y Control Social de Bosques y Tierra',
			sigla: 'assets/sistema/abt.png',
			cargo: 'Director Ejecutivo',
			persona: 'Luis Roberto Flores Orellana',
		},
		{
			nombre: 'Viceministerio de Medio Ambiente, Biodiversidad, Cambios Climáticos y de Gestión y Desarrollo Forestal',
			sigla: 'assets/sistema/mmya.png',
			cargo: 'Viceministro de Medio Ambiente, Biodiversidad, Cambios Climáticos y de Gestión y Desarrollo Forestal',
			persona: 'Franz Alvaro Quispe Olivera',
		},
		{
			nombre: 'Autoridad Plurinacional de la Madre Tierra',
			sigla: 'assets/sistema/madre.png',
			cargo: 'Directora Ejecutiva',
			persona: 'Angelica Ponce Chambi',
		},
		{
			nombre: 'Servicio Nacional de Áreas Protegidas',
			sigla: 'assets/sistema/sernav.png',
			cargo: 'Director General Ejecutivo',
			persona: 'Jair Gonzales Delgadillo',
		},
		{
			nombre: 'Museo Nacional de Historia Natural',
			sigla: 'assets/sistema/mnhn.png',
			cargo: 'Director General Ejecutivo',
			persona: 'Hugo Aranibar Rojas',
		},
	];
	groups: any;

	ngOnInit(): void {
		const filters = new UserParams();
		this.service.getAll(filters).subscribe({
			next: (data) => {
				this.groups = data.items;
				console.log('Grupos cargados:', this.groups);
			},
			error: (err) => {},
		});
	}
	vergrupodetrabajo(item: any) {
		this.grupoSeleccionado = item;
		this.currentStep = 3;
		console.log(item);
	}
	expandedActividadId: number | null = null;

	toggleActividad(id: number): void {
		this.expandedActividadId = this.expandedActividadId === id ? null : id;
	}
}
