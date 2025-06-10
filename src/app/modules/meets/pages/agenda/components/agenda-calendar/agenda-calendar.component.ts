import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-agenda-calendar',
  imports: [
    BreadcrumbModule,
    CalendarComponent,
    ButtonModule
  ],
  templateUrl: './agenda-calendar.component.html',
  styleUrl: './agenda-calendar.component.scss'
})
export class AgendaCalendarComponent {
  title: any
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('name');
    });
  }

}
