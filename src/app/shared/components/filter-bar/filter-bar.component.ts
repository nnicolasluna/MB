import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
	selector: 'app-filter-bar',
	imports: [FormsModule, SelectModule, ButtonModule, InputTextModule, ToggleButtonModule],
	templateUrl: './filter-bar.component.html',
	styleUrl: './filter-bar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
	public onSearch = output<string>();

	protected search = '';

	protected emitSearch(): void {
		this.onSearch.emit(this.search);
	}
}
