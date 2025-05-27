import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputErrorComponent } from '../input-error/input-error.component';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-input-text',
    imports: [NgClass, ReactiveFormsModule, InputErrorComponent, InputTextModule, PasswordModule, TextareaModule],
    templateUrl: './input-text.component.html',
    styleUrl: './input-text.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent {
	public label = input<string | null>(null);
	public placeholder = input<string>('');
	public type = input<string>('text');
	public name = input.required<string>();
	public readOnly = input<boolean>(false);
	public control = input.required<FormControl<any> | AbstractControl<any, any> | undefined>();
	public trim = input<boolean>(true);

	public maxLength = input<number | null>(null);

	public getLength(): number {
		return this.control()?.value?.length ?? 0;
	}

	public formControl: InputSignal<FormControl<any>> = this.control as InputSignal<FormControl<any>>;

	onBlur(_event: FocusEvent) {
		if (this.trim() && this.control()?.value?.trim) this.control()?.setValue(this.control()?.value?.trim());
	}
}
