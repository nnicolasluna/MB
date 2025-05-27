import { drawLocal } from 'leaflet';

export function changeDrawLocale() {
	drawLocal.draw = {
		toolbar: {
			buttons: {
				polygon: 'Dibujar un polígono',
				polyline: 'Dibujar una línea',
				rectangle: 'Dibujar un rectángulo',
				circle: 'Dibujar un círculo',
				marker: 'Dibujar un marcador',
				circlemarker: 'Dibujar un marcador circular',
			},
			actions: {
				title: 'Cancelar dibujo',
				text: 'Cancelar',
			},
			finish: {
				title: 'Finalizar dibujo',
				text: 'Finalizar',
			},
			undo: {
				title: 'Borrar último punto',
				text: 'Borrar último punto',
			},
		},
		handlers: {
			circle: {
				tooltip: {
					start: 'Haz clic y arrastra para dibujar un círculo.',
				},
				radius: 'Radio del círculo',
			},
			circlemarker: {
				tooltip: {
					start: 'Haz clic en el mapa para colocar un marcador circular.',
				},
			},
			marker: {
				tooltip: {
					start: 'Haz clic en el mapa para colocar un marcador.',
				},
			},
			polygon: {
				tooltip: {
					start: 'Haz clic para comenzar a dibujar un polígono.',
					cont: 'Haz clic para añadir otro punto.',
					end: 'Haz clic en el primer punto para cerrar el polígono.',
				},
			},
			polyline: {
				error: 'La línea debe tener al menos dos puntos.',
				tooltip: {
					start: 'Haz clic para comenzar a dibujar una línea.',
					cont: 'Haz clic para añadir otro punto.',
					end: 'Haz clic en el último punto para finalizar la línea.',
				},
			},
			rectangle: {
				tooltip: {
					start: 'Haz clic y arrastra para dibujar un rectángulo.',
				},
			},
			simpleshape: {
				tooltip: {
					end: 'Haz clic para finalizar la forma.',
				},
			},
		},
	};

	drawLocal.edit = {
		toolbar: {
			actions: {
				save: {
					title: 'Guardar cambios',
					text: 'Guardar',
				},
				cancel: {
					title: 'Cancelar edición',
					text: 'Cancelar',
				},
				clearAll: {
					title: 'Borrar todo',
					text: 'Borrar todo',
				},
			},
			buttons: {
				edit: 'Editar',
				editDisabled: 'Edición deshabilitada',
				remove: 'Eliminar',
				removeDisabled: 'Eliminación deshabilitada',
			},
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Haz clic en un objeto para editarlo.',
					subtext: 'Haz doble clic para abrir las opciones de edición.',
				},
			},
			remove: {
				tooltip: {
					text: 'Haz clic en un objeto para eliminarlo.',
				},
			},
		},
	};
}
