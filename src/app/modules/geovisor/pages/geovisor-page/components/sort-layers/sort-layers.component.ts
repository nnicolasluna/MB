import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActiveMap, StateService } from '@modules/geovisor/services/state.service';

@Component({
	selector: 'app-sort-layers',
	standalone: true,
	imports: [CdkDropListGroup, CdkDropList, CdkDrag],
	templateUrl: './sort-layers.component.html',
	styleUrl: './sort-layers.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortLayersComponent {
	public geovisorState = inject(StateService);

	public onDrop(event: CdkDragDrop<ActiveMap[], any, any>) {
		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

		const layers = event.container.data;

		for (let i = layers.length - 1; i >= 0; i--) {
			event.container.data[i].order = layers.length - i;
			(event.container.data[i] as any).bringToFront();
		}
	}
}
