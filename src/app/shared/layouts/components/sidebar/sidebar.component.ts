import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
	selector: 'app-sidebar',
	imports: [MenuComponent],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
	constructor(public el: ElementRef) {}
}
