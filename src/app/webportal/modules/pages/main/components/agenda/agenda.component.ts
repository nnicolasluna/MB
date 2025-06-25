import { Component } from '@angular/core';
import { CalendarComponent } from "../../../../../../shared/components/calendar/calendar.component";

@Component({
  selector: 'app-agenda',
  imports: [CalendarComponent],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent {

}
