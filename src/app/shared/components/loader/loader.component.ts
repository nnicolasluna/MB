import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-loader',
    imports: [ProgressBarModule, ProgressSpinnerModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
	type = input<'spinner' | 'bar'>('spinner');
	value = input<number | undefined>(undefined);
	message = input<string | undefined>(undefined);
}
