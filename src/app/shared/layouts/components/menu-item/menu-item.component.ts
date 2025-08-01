import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from '../../services/layout.service';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ExtendedMenuItem } from '@shared/layouts/interfaces/menu-item.interface';
import { PermissionDirective } from '@shared/directives';

@Component({
	selector: '[app-layout-menu-item]',
	imports: [CommonModule, RouterModule, RippleModule, TooltipModule, PermissionDirective],
	templateUrl: './menu-item.component.html',
	styleUrl: './menu-item.component.scss',
	animations: [
		trigger('children', [
			state(
				'collapsed',
				style({
					height: '0',
				}),
			),
			state(
				'expanded',
				style({
					height: '*',
				}),
			),
			transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
		]),
	],
	providers: [LayoutService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent implements OnInit, OnDestroy {
	@Input() item!: ExtendedMenuItem;

	@Input() index!: number;

	@Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

	@Input() parentKey!: string;

	active = false;

	menuSourceSubscription: Subscription;

	menuResetSubscription: Subscription;

	key: string = '';

	// sidebarActive = signal(false);

	constructor(
		public router: Router,
		private layoutService: LayoutService,
	) {
		this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
			Promise.resolve(null).then(() => {
				if (value.routeEvent) {
					this.active = value.key === this.key || value.key.startsWith(this.key + '-') ? true : false;
				} else {
					if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
						this.active = false;
					}
				}
			});
		});

		this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
			this.active = false;
		});

		this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((_params) => {
			if (this.item.routerLink) {
				this.updateActiveStateFromRoute();
			}
		});
	}

	ngOnInit() {
		this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

		if (this.item.routerLink) {
			this.updateActiveStateFromRoute();
		}
	}

	updateActiveStateFromRoute() {
		let activeRoute = this.router.isActive(this.item.routerLink[0], {
			paths: 'exact',
			queryParams: 'ignored',
			matrixParams: 'ignored',
			fragment: 'ignored',
		});

		if (activeRoute) {
			this.layoutService.onMenuStateChange({ key: this.key, routeEvent: true });
		}
	}

	itemClick(event: Event) {
		// avoid processing disabled items
		if (this.item.disabled) {
			event.preventDefault();
			return;
		}

		// execute command
		if (this.item.command) {
			this.item.command({ originalEvent: event, item: this.item });
		}

		// toggle active state
		if (this.item.items) {
			this.active = !this.active;
		}

		this.layoutService.onMenuStateChange({ key: this.key });
	}

	get submenuAnimation() {
		return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
	}

	@HostBinding('class.active-menuitem')
	get activeClass() {
		return this.active && !this.root;
	}

	ngOnDestroy() {
		if (this.menuSourceSubscription) {
			this.menuSourceSubscription.unsubscribe();
		}

		if (this.menuResetSubscription) {
			this.menuResetSubscription.unsubscribe();
		}
	}
}
