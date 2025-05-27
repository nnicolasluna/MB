import { ChangeDetectionStrategy, Component, inject, Injector, input, viewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { Menu, MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'app-actions-menu',
	imports: [ButtonModule, MenuModule, ContextMenuModule, TooltipModule],
	templateUrl: './actions-menu.component.html',
	styleUrl: './actions-menu.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsMenuComponent {
	public inline = input(false);
	public actions = input<MenuItem[]>([]);

	public ctxMenuTemplate = input<HTMLElement>();
	public injector = inject(Injector);

	private _menu = viewChild<Menu>('menu');

	public onContextMenuShow() {
		this._menu()?.hide();
	}
}
