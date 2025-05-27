import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { DecIncWaterComponent } from './components/dec-inc-water/dec-inc-water.component';
import { SliderModule } from 'primeng/slider';
import { GeoMonitoringWaterComponent } from '../geo-monitoring-water/geo-monitoring-water.component';

@Component({
	selector: 'app-side-monitoring-water',
	imports: [
		SliderModule,
		ButtonModule,
		DecIncWaterComponent,
		ReactiveFormsModule,
		FormsModule,
		ChartModule,
		MultiSelectModule,
		AccordionModule,
		SelectModule,
		TabsModule,
		GeoMonitoringWaterComponent,
	],
	templateUrl: './monitoring-water.component.html',
	styleUrl: './monitoring-water.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMonitoringWaterComponent {
	public currentMonitoringTab = model(0);
}
