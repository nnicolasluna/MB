import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { GeoHotSpotsComponent } from '../geo-hot-spots/geo-hot-spots.component';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { GeoMonitoringBurnComponent } from '../geo-monitoring-burn/geo-monitoring-burn.component';
import { GeoMonitoringRiskComponent } from '../geo-monitoring-fire/geo-monitoring-fire.component';

@Component({
	selector: 'app-side-monitoring-fire',
	imports: [
		ButtonModule,
		ReactiveFormsModule,
		FormsModule,
		GeoHotSpotsComponent,
		MultiSelectModule,
		AccordionModule,
		SelectModule,
		TabsModule,
		ChartModule,
		GeoMonitoringBurnComponent,
		GeoMonitoringRiskComponent,
	],
	templateUrl: './monitoring-fire.component.html',
	styleUrl: './monitoring-fire.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoMonitoringFireComponent {
	public currentMonitoringTab = model(0);
}
