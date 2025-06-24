import { Component, inject, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '@modules/meets/services/activity.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent } from '@shared/components';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';
import { BaseParams, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FormActividadesComponent } from '../form-actividades/form-actividades.component';
import { AGENDA_TABLE_COLUMNS } from '@modules/meets/constants/agenda';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
	selector: 'app-agenda-calendar',
	imports: [BreadcrumbModule, CalendarComponent, ButtonModule, CommonModule],
	templateUrl: './agenda-calendar.component.html',
	styleUrl: './agenda-calendar.component.scss',
})
export class AgendaCalendarComponent extends BaseListFiltersComponent<any> {
	title: any;
	activities: any;
	data$ = new BehaviorSubject<any>([]);
	override tableColumns: ColumnTableModel[] = AGENDA_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(ActivityService);
	override formDialog: Type<any> = FormActividadesComponent;
	override onActionClick(): void { }
	constructor(private route: ActivatedRoute) {
		super();
		this.addBreadcrub({ label: 'Reuniones y Convocatorias', routerLink: '' });
		this.addBreadcrub({ label: 'Administración de Agenda', routerLink: '/meets/agenda' });
		this.getActivities();
	}
	ngOnInit(): void {

		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
			this.addBreadcrub({ label: this.title, routerLink: '/meets/agenda/calendar' });
		});
	}
	/* getActivities(): void {
		this.service.getAll(this.filters).subscribe({
			next: (response) => {
				this.activities = response;
				this.data = (response.items as any[]).flatMap((item: any) =>
					item.Tarea.flatMap((tarea: any) =>
						tarea.FechaProgramada.map((fecha: any) => ({
							Fecha: new Date(fecha.fechaHora).toLocaleDateString('es-BO'),
							Objetivo: tarea.nombre,
							ESTADO: 'EN PROGRESO',
							reunionExtraOrdinaria: item.tipo !== 'Ordinaria',
						}))
					)
				);
			},
			error: (error) => {
				console.error(error);
			}
		});
	} */
	/* getActivities(): void {
		this.service.getAll(this.filters).subscribe({
			next: (response) => {
				this.activities = response;
				const processedData = (response.items as any[]).flatMap((item: any) =>
					item.Tarea.flatMap((tarea: any) =>
						tarea.FechaProgramada.map((fecha: any) => ({
							
							Fecha: new Date(fecha.fechaHora).toLocaleDateString('es-BO'),
							Objetivo: tarea.nombre,
							ESTADO: 'EN PROGRESO',
							reunionExtraOrdinaria: item.tipo !== 'Ordinaria',
						}))
					)
				);
				this.data$.next(processedData);
				console.log(this.data$)
			},
			error: (error) => {
				console.error(error);
			}
		});
	} */
	getActivities(): void {
		this.service.getAll(this.filters).subscribe({
			next: (response) => {
				this.activities = response;

				const today = new Date();

				const processedData = (response.items as any[]).flatMap((item: any) =>
					item.Tarea.flatMap((tarea: any) =>
						tarea.FechaProgramada.map((fecha: any) => {
							const fechaDate = new Date(fecha.fechaHora);

							// Diferencia en meses entre fechaDate y hoy
							const diffMonths = (today.getMonth() - fechaDate.getMonth());

							let estado = '';

							if (tarea.acta && tarea.acta.trim() !== '') {
								estado = 'REALIZADO';
							} else if ((!tarea.acta || tarea.acta.trim() === '') && fechaDate < today) {
								estado = 'SIN REALIZAR';
							} else if (diffMonths <= 3) {
								estado = 'POR REALIZAR';
							} else if (diffMonths > -3) {
								estado = 'NO REALIZADO';
							}
							else {
								estado = 'NO REALIZADO';
							}
							console.log(today.getMonth(), fechaDate.getMonth(), diffMonths)
							return {
								Fecha: fechaDate.toLocaleDateString('es-BO'),
								Objetivo: tarea.nombre,
								ESTADO: estado,
								reunionExtraOrdinaria: item.tipo !== 'Ordinaria',
							};
						})
					)
				);

				this.data$.next(processedData);
				console.log(this.data$);
			},
			error: (error) => {
				console.error(error);
			}
		});
	}
	reloadpage(): void {
		window.location.reload();
	}
}