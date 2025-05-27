import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-guide-water-modal',
	imports: [ButtonModule],
	templateUrl: './guide-modal.component.html',
	styleUrls: ['./guide-modal.component.css'],
})
export class GuideModalComponent implements OnDestroy {
	private _ref = inject(DynamicDialogRef);

	step = signal(0);

	public ngOnDestroy(): void {
		this._ref.close();
	}

	public onClose() {
		this._ref.close();
	}
}
