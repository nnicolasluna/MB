export const BASE_LAYERS = [
	{
		name: 'OpenStreetMap',
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	},
	{
		name: 'Google Streets',
		url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
	},
	{
		name: 'Google Satelite',
		url: 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
	},
];

export const MAP_CENTER = [-16.699340234594537, -65.34667968750001];
