import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { rexPatternMessages } from '@shared/constants';

@Component({
    selector: 'app-input-error',
    imports: [NgIf],
    templateUrl: './input-error.component.html',
    styleUrl: './input-error.component.scss'
})
export class InputErrorComponent {
	public control = input.required<FormControl | AbstractControl<any, any> | null | undefined>();

	public getPatternMessage(pattern: RegExp): string {
		return rexPatternMessages[pattern.toString()] ?? 'El campo contiene caracteres inválidos';
	}
}
