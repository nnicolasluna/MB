import { ChangeDetectionStrategy, Component, Renderer2, ViewChild } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { LayoutService } from '../../services/layout.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-main',
	imports: [CommonModule, SidebarComponent, TopbarComponent, RouterModule],
	templateUrl: './main.layout.html',
	styleUrl: './main.layout.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
	overlayMenuOpenSubscription: Subscription;

	menuOutsideClickListener: any;

	@ViewChild(SidebarComponent) appSidebar!: SidebarComponent;

	@ViewChild(TopbarComponent) appTopBar!: TopbarComponent;

	constructor(
		public layoutService: LayoutService,
		public renderer: Renderer2,
		public router: Router,
	) {
		this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
			if (!this.menuOutsideClickListener) {
				this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
					if (this.isOutsideClicked(event)) {
						this.hideMenu();
					}
				});
			}

			if (this.layoutService.layoutState().staticMenuMobileActive) {
				this.blockBodyScroll();
			}
		});

		this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
			this.hideMenu();
		});
	}

	isOutsideClicked(event: MouseEvent) {
		const sidebarEl = document.querySelector('.layout-sidebar');
		const topbarEl = document.querySelector('.layout-menu-button');
		const eventTarget = event.target as Node;

		return !(
			sidebarEl?.isSameNode(eventTarget) ||
			sidebarEl?.contains(eventTarget) ||
			topbarEl?.isSameNode(eventTarget) ||
			topbarEl?.contains(eventTarget)
		);
	}

	hideMenu() {
		this.layoutService.layoutState.update((prev) => ({
			...prev,
			overlayMenuActive: false,
			staticMenuMobileActive: false,
			menuHoverActive: false,
		}));
		if (this.menuOutsideClickListener) {
			this.menuOutsideClickListener();
			this.menuOutsideClickListener = null;
		}
		this.unblockBodyScroll();
	}

	blockBodyScroll(): void {
		if (document.body.classList) {
			document.body.classList.add('blocked-scroll');
		} else {
			document.body.className += ' blocked-scroll';
		}
	}

	unblockBodyScroll(): void {
		if (document.body.classList) {
			document.body.classList.remove('blocked-scroll');
		} else {
			document.body.className = document.body.className.replace(
				new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
				' ',
			);
		}
	}

	get containerClass() {
		return {
			'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
			'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
			'layout-static-inactive':
				this.layoutService.layoutState().staticMenuDesktopInactive &&
				this.layoutService.layoutConfig().menuMode === 'static',
			'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
			'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive,
		};
	}

	ngOnDestroy() {
		if (this.overlayMenuOpenSubscription) {
			this.overlayMenuOpenSubscription.unsubscribe();
		}

		if (this.menuOutsideClickListener) {
			this.menuOutsideClickListener();
		}
	}

	// overlayMenuOpenSubscription: Subscription;
	//
	// menuOutsideClickListener: any;
	//
	// profileMenuOutsideClickListener: any;
	//
	// @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;
	//
	// @ViewChild(TopbarComponent) appTopbar!: TopbarComponent;
	//
	// constructor(
	// 	public layoutService: LayoutService,
	// 	public renderer: Renderer2,
	// 	public router: Router,
	// ) {
	// 	this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
	// 		if (!this.menuOutsideClickListener) {
	// 			this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
	// 				const isOutsideClicked = !(
	// 					this.appSidebar.el.nativeElement.isSameNode(event.target) ||
	// 					this.appSidebar.el.nativeElement.contains(event.target) ||
	// 					(this.appTopbar.menuButton as any).el.nativeElement.isSameNode(event.target) ||
	// 					(this.appTopbar.menuButton as any).el.nativeElement.contains(event.target)
	// 				);
	//
	// 				if (isOutsideClicked) {
	// 					this.hideMenu();
	// 				}
	// 			});
	// 		}
	//
	// 		if (!this.profileMenuOutsideClickListener) {
	// 			this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
	// 				const isOutsideClicked = !(
	// 					this.appTopbar.menu.nativeElement.isSameNode(event.target) ||
	// 					this.appTopbar.menu.nativeElement.contains(event.target) ||
	// 					(this.appTopbar.topbarMenuButton as any).el.nativeElement.isSameNode(event.target) ||
	// 					(this.appTopbar.topbarMenuButton as any).el.nativeElement.contains(event.target)
	// 				);
	//
	// 				if (isOutsideClicked) {
	// 					this.hideProfileMenu();
	// 				}
	// 			});
	// 		}
	//
	// 		if (this.layoutService.state().staticMenuMobileActive) {
	// 			this.blockBodyScroll();
	// 		}
	// 	});
	//
	// 	this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
	// 		this.hideMenu();
	// 		this.hideProfileMenu();
	// 	});
	// }
	//
	// @HostListener('window:resize', ['$event'])
	// onResize(event: Event) {
	// 	this.layoutService.emitResizeEvent(event);
	// }
	//
	// hideMenu() {
	// 	this.layoutService.state.update((value) => {
	// 		return { ...value, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false };
	// 	});
	//
	// 	if (this.menuOutsideClickListener) {
	// 		this.menuOutsideClickListener();
	// 		this.menuOutsideClickListener = null;
	// 	}
	// 	this.unblockBodyScroll();
	// }
	//
	// hideProfileMenu() {
	// 	this.layoutService.state.update((value) => {
	// 		return { ...value, profileSidebarVisible: false };
	// 	});
	// 	if (this.profileMenuOutsideClickListener) {
	// 		this.profileMenuOutsideClickListener();
	// 		this.profileMenuOutsideClickListener = null;
	// 	}
	// }
	//
	// blockBodyScroll(): void {
	// 	if (document.body.classList) {
	// 		document.body.classList.add('blocked-scroll');
	// 	} else {
	// 		document.body.className += ' blocked-scroll';
	// 	}
	// }
	//
	// unblockBodyScroll(): void {
	// 	if (document.body.classList) {
	// 		document.body.classList.remove('blocked-scroll');
	// 	} else {
	// 		document.body.className = document.body.className.replace(
	// 			new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
	// 			' ',
	// 		);
	// 	}
	// }
	//
	// get containerClass() {
	// 	return {
	// 		'layout-overlay': this.layoutService.config().menuMode === 'overlay',
	// 		'layout-static': this.layoutService.config().menuMode === 'static',
	// 		'layout-static-inactive':
	// 			this.layoutService.state().staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
	// 		'layout-overlay-active': this.layoutService.state().overlayMenuActive,
	// 		'layout-mobile-active': this.layoutService.state().staticMenuMobileActive,
	// 	};
	// }
	//
	// ngOnDestroy() {
	// 	if (this.overlayMenuOpenSubscription) {
	// 		this.overlayMenuOpenSubscription.unsubscribe();
	// 	}
	//
	// 	if (this.menuOutsideClickListener) {
	// 		this.menuOutsideClickListener();
	// 	}
	// }
}
