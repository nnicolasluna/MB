import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-top-bar',
	imports: [RouterModule, CommonModule],
	templateUrl: './top-bar.component.html',
	styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
	menuItems = [
		{ label: 'INICIO', route: 'inicio' },
		{ label: 'RESEÑA INSTITUCIONAL', route: 'resena' },
		{ label: 'COORDINACIÓN Y MIEMBROS', route: 'coordinacion' },
/* 		{ label: 'REUNIONES Y AGENDA', route: 'agenda' }, */
		{ label: 'REPOSITORIO DOCUMENTAL', route: 'repositorio' },
		{ label: 'LINEA DE TIEMPO', route: 'timeline' },
		{ label: 'SISTEMAS DE INFORMACION', route: 'informacion' }
	];
	sidebarOpen: boolean = false;

	toggleSidebar() {
		this.sidebarOpen = !this.sidebarOpen;
	}
}
