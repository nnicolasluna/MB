import { Component } from '@angular/core';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { RouterModule } from '@angular/router';
@Component({
	selector: 'app-main',
	imports: [TopBarComponent, RouterModule],
	templateUrl: './main.component.html',
	styleUrl: './main.component.scss',
})
export class MainComponent {}
