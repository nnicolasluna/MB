import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { GeoSoilAlertComponent } from '../geo-soil-alert/geo-soil-alert.component';
import { GeoMonitoringUseComponent } from '../geo-monitoring-use/geo-monitoring-use.component';

@Component({
	selector: 'app-side-monitoring-use',
	imports: [
		ButtonModule,
		ReactiveFormsModule,
		FormsModule,
		MultiSelectModule,
		AccordionModule,
		SelectModule,
		TabsModule,
		ChartModule,
		GeoSoilAlertComponent,
		GeoMonitoringUseComponent,
	],
	templateUrl: './monitoring-use.component.html',
	styleUrl: './monitoring-use.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMonitoringUseComponent {
	public currentMonitoringTab = model(0);
}
