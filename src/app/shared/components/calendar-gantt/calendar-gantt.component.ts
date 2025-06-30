import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


interface GanttTask {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
}
@Component({
  selector: 'app-calendar-gantt',
  imports: [CommonModule],
  templateUrl: './calendar-gantt.component.html',
  styleUrl: './calendar-gantt.component.scss'
})
export class CalendarGanttComponent implements OnInit {
  tasks: GanttTask[] = [
    {
      id: 1,
      name: 'Análisis de Requisitos',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-15'),
      progress: 100,
      color: '#3498db'
    },
    {
      id: 2,
      name: 'Diseño de Sistema',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-01-30'),
      progress: 75,
      color: '#e74c3c'
    },
    {
      id: 3,
      name: 'Desarrollo Frontend',
      startDate: new Date('2025-01-25'),
      endDate: new Date('2025-02-20'),
      progress: 45,
      color: '#2ecc71'
    },
    {
      id: 4,
      name: 'Desarrollo Backend',
      startDate: new Date('2025-01-25'),
      endDate: new Date('2025-02-25'),
      progress: 30,
      color: '#f39c12'
    },
    {
      id: 5,
      name: 'Testing',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-03-05'),
      progress: 0,
      color: '#9b59b6'
    },
    {
      id: 6,
      name: 'Despliegue',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-10'),
      progress: 0,
      color: '#1abc9c'
    }
  ];
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

  ngOnInit() {
    this.calculateTimeScale();
  }

  calculateTimeScale() {
    const startDates = this.tasks.map(task => task.startDate);
    const endDates = this.tasks.map(task => task.endDate);

    this.projectStartDate = new Date(Math.min(...startDates.map(d => d.getTime())));
    this.projectEndDate = new Date(Math.max(...endDates.map(d => d.getTime())));

    // Generar escala de tiempo (días)
    this.timeScale = [];
    const currentDate = new Date(this.projectStartDate);

    while (currentDate <= this.projectEndDate) {
      this.timeScale.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  getTaskPosition(task: GanttTask) {
    const totalDays = this.timeScale.length;
    const dayWidth = 100 / totalDays;

    const startDayIndex = this.timeScale.findIndex(date =>
      date.toDateString() === task.startDate.toDateString()
    );

    const taskDuration = Math.ceil(
      (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    return {
      left: startDayIndex * dayWidth,
      width: taskDuration * dayWidth
    };
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
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
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.progress = Math.max(0, Math.min(100, newProgress));
    }
  }
}
