import { definePreset, palette } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

//INFO: More information: https://primeng.org/theming

const customPalette = palette('#06561a');
const darkSurface = palette('#282F3A');

export const themePreset = definePreset(Aura, {
	semantic: {
		primary: customPalette,
		// primary: {
		// 	50: '{blue.50}',
		// 	100: '{blue.100}',
		// 	200: '{blue.200}',
		// 	300: '{blue.300}',
		// 	400: '{blue.400}',
		// 	500: '{blue.500}',
		// 	600: '{blue.600}',
		// 	700: '{blue.700}',
		// 	800: '{blue.800}',
		// 	900: '{blue.900}',
		// 	950: '{blue.950}',
		// },

		colorScheme: {
			light: {
				surface: {
					0: '#ffffff',
					50: '{slate.50}',
					100: '{slate.100}',
					200: '{slate.200}',
					300: '{slate.300}',
					400: '{slate.400}',
					500: '{slate.500}',
					600: '{slate.600}',
					700: '{slate.700}',
					800: '{slate.800}',
					900: '{slate.900}',
					950: '{slate.950}',
				},
			},
			dark: {
				surface: {
					0: '#ffffff',
					...darkSurface,
				},
			},
		},
	},
	// Custom theme
	components: {
		accordion: {
			'header.active.hover.color': 'var(--p-accordion-header-active-color)',
		},
		tabs: {
			colorScheme: {
				light: {
					tab: {
						background: 'var(--p-surface-200)',
						activeBackground: '{primary.700}',
						color: 'var(--p-surface-700)',
						activeColor: 'var(--p-surface-200)',
					},
				},
				dark: {
					tab: {
						background: 'var(--p-surface-800)',
						color: 'var(--p-surface-300)',
						activeColor: 'var(--p-surface-50)',
					},
				},
			},
		},
		card: {
			titleFontWeight: 'bold',
			colorScheme: {
				light: {
					background: 'var(--p-surface-200)',
				},
				dark: {
					background: 'var(--p-surface-800)',
				},
			},
		},
		button: {
			colorScheme: {
				dark: {
					primary: {
						background: 'var(--p-primary-500)',
						color: 'var(--p-surface-50)',
					},
					secondary: {
						color: 'var(--p-surface-50)',
					},
				},
			},
		},
		breadcrumb: {
			colorScheme: {
				light: {
					item: {
						color: 'var(--p-surface-500)',
						icon: {
							color: 'var(--p-surface-500)',
						},
					},
				},
				dark: {
					item: {
						color: 'var(--p-surface-200)',
						icon: {
							color: 'var(--p-surface-200)',
						},
					},
				},
			},
		},
	},
});
