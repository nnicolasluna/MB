import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
@Component({
	selector: 'app-inicio',
	imports: [CommonModule],
	templateUrl: './inicio.component.html',
	styleUrl: './inicio.component.scss',
})
export class InicioComponent implements AfterViewInit {
	private map!: L.Map;
	mostrarTable = true;
	bosqueSeleccionado: any | undefined;
	bosquesData = [
		{
			nombre: 'BOSQUE AMAZÓNICO',
			descripcion:
				'Se extiende en todo el Departamento de Pando, el norte del Departamento de La Paz, el norte y suroeste del Departamento del Beni, el norte del Departamento de Cochabamba y el noroeste del Departamento de Santa Cruz. Esta ecorregión ocupa una llanura ondulada, disectada por llanuras aluviales y terrazas fluviales de los grandes ríos de las cuencas del río Beni y Madre de Dios. Se prolonga hacia el sur, siguiendo el margen o piedemonte de la cordillera oriental. La altitud general varía entre los 100 y 400 m s. n. m., aunque en la transición con las serranías bajas de la región subandina y los Yungas puede alcanzar entre 1000 y 1300 m s. n. m. El clima es cálido y húmedo, con precipitaciones anuales entre 1800 y 2200 mm, y temperaturas promedio entre 25 °C y 27 °C. El Bosque Amazónico está constituido por bosques siempreverdes, pluviestacionales, subhúmedos a húmedos (hiperhúmedos en algunas zonas), con estructura multiestratificada. El dosel alcanza entre 20 y 35 metros de altura, con árboles emergentes que pueden superar los 40 metros.',
			superficie_ha: 21295550,
			color: '#015100',
		},
		{
			nombre: 'BOSQUE CHIQUITANO',
			descripcion:
				'Se localiza en el norte y este del departamento de Santa Cruz en las provincias Ñuflo de Chávez, Velasco, Sandoval, Guarayos y el norte de Chiquitos y, en su mayor parte, pertenece a la cuenca Amazónica, mientras que pequeñas áreas del sureste drenan hacia la cuenca del Plata. Su relieve abarca planicies onduladas, llanuras aluviales, colinas y amplios valles, con altitudes de 300 a 1200 m s. n. m. El clima es marcadamente estacional: una temporada de lluvias intensas contrasta con una estación seca de 3–5 meses; las precipitaciones promedian 1000–1500 mm anuales y la temperatura media ronda los 23 °C. El dosel del bosque mide entre 10 y 20 m, con emergentes de hasta 25 m. Entre las especies más frecuentes aparecen Cordia alliodora (picana), Terminalia argentea (verdolaga), Astronium urundeuva (cuchi), Schinopsis brasiliensis (soto), Anadenanthera colubrina (curupaú), Handroanthus impetiginosus (tajibo rosado), Handroanthus chrysanthus (tajibo amarillo), Cereus sp. (cacto), Phyllostylon rhamnoides (cuta), Aspidosperma cylindrocarpon (jichituriqui), Chorisia speciosa (toborochi) y Machaerium scleroxylon (morado).',
			superficie_ha: 8956801,
			color: '#A57200',
		},
		{
			nombre: 'BOSQUE SECO INTERANDINO',
			descripcion:
				'Este conjunto de ecosistemas áridos y semiáridos se encuentra entre las cordilleras Oriental y Occidental, abarcando valles, mesetas, colinas y montañas en los departamentos de La Paz, la región central y sur de Cochabamba, los valles de Chuquisaca, Potosí y Tarija, así como el occidente de Santa Cruz. Se desarrolla principalmente entre los 1500 y 3000 m s. n. m., aunque puede extenderse desde los 1000 hasta los 3300 m en ciertas áreas. El clima es seco a semiárido, con precipitaciones anuales entre 200 y 650 mm y una estación seca invernal muy marcada. Las temperaturas promedio oscilan entre 14 y 19 °C. Estas condiciones dan lugar a una vegetación xerófila, dominada por plantas espinosas, suculentas y de follaje caducifolio en época seca. En el paisaje predominan arbustos, cactáceas y árboles leguminosos que conforman matorrales espinosos. Entre los géneros más representativos están Schinus, Opuntia, Puya, Echinopsis, Rebutia, Cleistocactus y Trichocereus. A menor altitud (1000–2600 m s. n. m.), se encuentran bosques abiertos con estrato arbóreo de hasta 10 m, de composición florística similar al bosque chaqueño, con especies como Schinopsis haenkeana (soto), Aspidosperma quebrachoblanco (kacha kacha), Astronium urundeuva (cuchi), Loxopterygiun grisebachii (soto-mara) y Athyana weinmannifolia (sotillo).',
			superficie_ha: 933163,
			color: '#A7A803',
		},
		{
			nombre: 'BOSQUE TUCUMANO BOLIVIANO',
			descripcion:
				'Este bosque se extiende por las laderas, valles y serranías orientales de la Cordillera Oriental, abarcando desde el sur del departamento de Cochabamba hasta Tarija, e incluyendo el oeste de Santa Cruz, el noreste de Potosí y el departamento de Chuquisaca, en un rango altitudinal amplio que va desde los 400 hasta los 4000 m s. n. m. Limita al occidente con los bosques interandinos altos de las cuencas de los ríos Grande, Pilcomayo y Parapetí, y al norte contacta con los Yungas en el oeste de Santa Cruz. Debido a su ubicación más austral y a la orientación norte-sur de sus serranías, esta región es particularmente afectada por los frentes fríos invernales del sur (conocidos como “surazos”), lo que genera temperaturas mínimas promedio más bajas que en los Yungas. A ello se suma su cercanía al cinturón de altas presiones subtropicales, lo que provoca precipitaciones significativamente menores. En consecuencia, no se desarrolla el bioclima pluvial típico de los Yungas; predominan en cambio los bioclimas pluviestacional (en exposiciones hacia el este) y xérico (en laderas occidentales y fondos de valle), con escasa similitud florística respecto a los Yungas.',
			superficie_ha: 3148936,
			color: '#B5D73B',
		},
		{
			nombre: 'BOSQUE CHAQUEÑO',
			descripcion:
				'Este ecosistema se extiende por el sur del departamento de Santa Cruz y el este de Chuquisaca y Tarija, ocupando las vastas llanuras aluviales antiguas de los ríos Grande, Parapetí, Pilcomayo y Otuquis. Hacia el sureste, extensos depósitos eólicos conforman los campos de dunas de Guanacos, Yanahigua y Parapetí. El clima es predominantemente seco y llega a ser semiárido en la franja fronteriza con Paraguay, en el centro-sur de la provincia Cordillera (Santa Cruz), una de las zonas más áridas de Bolivia. Las lluvias siguen un régimen tropical con máximos en la época más cálida; la altitud varía entre 300 y 600 m s. n. m., las precipitaciones oscilan entre 500 y 1000 mm anuales, la estación seca dura de 4 a 8 meses y la temperatura media anual va de 22 °C cerca de la cordillera a 26 °C en el interior del Chaco.',
			superficie_ha: 9439003,
			color: '#2DCE10',
		},
		{
			nombre: 'BOSQUES DE LLANURAS INUNDABLES',
			descripcion:
				'Se distribuyen en los llanos húmedos del Beni, el noroeste de Santa Cruz (provincias Ñuflo de Chávez, Santiesteban, Sara e Ichilo) y el noreste de la provincia Chapare en Cochabamba, a 150 – 250 m s. n. m. El clima es subhúmedo, con 2 – 4 meses secos, precipitaciones anuales de 1200 – 1800 mm y una temperatura media de unos 25 °C. La mayor parte del paisaje corresponde a suelos mal drenados, anegados o inundados. Allí aparecen bosques semideciduos restringidos a pequeños domos ligeramente elevados; y bosques de galería o ribereños, siempreverdes o siempreverdes estacionales, de dosel bajo (8 – 10 m) que forman franjas continuas a lo largo de riachuelos y arroyos. Estos bosquecillos permanecen sumergidos hasta medio año, alcanzando 1 – 1,5 m de agua. Entre sus especies típicas figuran Anadenanthera colubrina (curupaú), Croton sampatik (manguillo), Albizia inundata (asotocoso), Rheedia achachairu (achachairú), Salacia impressifolia (guapomó), Xylopia ligustrifolia (piraquina), Calycophyllum spruceanum (guayabochi) y Symphonia globulifera (resina amarilla); las palmas Socratea exorrhiza (pachiubilla) y Scheelea princeps (motacú) son abundantes en estos ambientes inundados.',
			superficie_ha: 3984909,
			color: '#74F899',
		},
		{
			nombre: 'BOSQUE PANTANAL',
			descripcion:
				'Este ecosistema se ubica en el este del departamento de Santa Cruz, especialmente en las provincias Ángel Sandoval, Germán Busch y el sudeste de Velasco. Corresponde a zonas estacionalmente inundables debido a las lluvias y desbordes de los ríos, situadas entre los 69 y 160 m s. n. m. El clima es cálido, con temperaturas promedio anuales entre 26 °C y 28 °C, y precipitaciones que varían entre 1000 y 1400 mm por año. Las áreas más elevadas y menos sujetas a inundaciones presentan una vegetación con afinidad florística a la Chiquitanía, mientras que las zonas con mal drenaje o anegamiento estacional muestran influencias del Chaco. La vegetación está compuesta por bosques abiertos de baja o media altura (6–10 m), densos a semidensos, sabanas arboladas y sectores con palmares. Esta región presenta una gran variación ecológica, fisonómica y florística, determinada por factores como la textura del suelo, el grado de saturación hídrica y el nivel de intervención antrópica. Entre sus especies más representativas se encuentran Machaerium hirtum (tusequi), Handroanthus heptaphyllus (tajibo), Handroanthus aureus (alcornoque) y Triplaris gardneriana.',
			superficie_ha: 1553368,
			color: '#12954F',
		},
		{
			nombre: 'BOSQUE YUNGAS',
			descripcion:
				'Se ubica en las faldas orientales de los Andes, abarcando los departamentos de La Paz, Cochabamba y Santa Cruz. Esta región presenta un relieve variado que incluye cadenas montañosas con lomas, laderas anchas, quebradas y valles estrechos, con altitudes que van desde los 400 hasta más de 3200 m s. n. m. El clima es variable, pero generalmente húmedo a subhúmedo. En la zona del Chapare (Cochabamba), las precipitaciones pueden superar los 5000 mm anuales, aunque en otras áreas no suelen superar los 2000 mm. La temperatura oscila entre 17 °C y 24 °C. Debido a la orografía, las nubes chocan constantemente con el bosque, manteniendo condiciones de humedad alta durante todo el año.',
			superficie_ha: 5501989,
			color: '#CDF57B',
		},
		{
			nombre: 'BOSQUE ANDINO',
			descripcion:
				'Esta región abarca el sur del departamento de La Paz, el suroeste de Cochabamba, casi la totalidad de Oruro y Potosí, además del occidente de Chuquisaca y Tarija. Predominan principalmente las gramíneas y plantas herbáceas, aunque también hay numerosas especies arbustivas y, de forma ocasional, ejemplares arbóreos. La temperatura promedio anual generalmente es inferior a 10 °C y la precipitación no supera los 500 mm al año. Dentro de este piso bioclimático se encuentran los bosques puneños bajos o arbustales de Polylepis tarapacana (ubicados entre 3900 y 4700 msnm), los cardonales altoandinos de la Cordillera Occidental y el oeste del Altiplano, así como bosques puneños bajos y arbustales siempre verdes estacionales de Polylepis en la Cordillera Oriental y altiplano norte. También se desarrollan matorrales de thola (Parastrephia y Baccharis) con un dosel semicerrado a abierto que varía entre 0.5 y 5 m de altura. Aunque la mayoría de estas comunidades altoandinas están dominadas por gramíneas y arbustos pequeños, algunos cerros presentan manchas o cinturones de bosques bajos y ralos dominados por especies siempreverdes del género Polylepis (conocidas como queñua o kewiña). Su mayor desarrollo se da en la Cordillera Occidental, donde los queñuales forman un anillo alrededor de las laderas de los volcanes entre 4200 y 4900 msnm, con individuos aislados que alcanzan hasta 5200 msnm (como en el nevado Sajama).',
			superficie_ha: 45879,
			color: '#738843',
		},
	];
	ngAfterViewInit(): void {
		this.iniciarMapa();
	}

	private iniciarMapa(): void {
		if (this.map) {
			this.map.remove();
		}
		this.map = L.map('map', {
			center: [-15, -59],
			zoom: 6,
			scrollWheelZoom: true,
			dragging: true,
			zoomControl: false,
			doubleClickZoom: false,
			minZoom: 6,
			maxZoom: 10,
		});
		this.map.setZoom(6.4);
		L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 18,
		}).addTo(this.map);
		const labelsLayer = L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
			{
				maxZoom: 18,
				pane: 'labels',
			}
		);

		if (!this.map.getPane('labels')) {
			this.map.createPane('labels');
			this.map.getPane('labels')!.style.zIndex = '';
			this.map.getPane('labels')!.style.pointerEvents = 'none';
		}

		labelsLayer.addTo(this.map);
		this.map.on('zoomend', () => {
			if (this.map.getZoom() === 6) {
				this.map.setView([-16, -65]);
			}
		});
	}
	verDetalles(data: string) {
		this.mostrarTable = false;
		this.bosqueSeleccionado = this.bosquesData.find((bosque) => bosque.nombre === data.toUpperCase());
		if (this.bosqueSeleccionado) {
			console.log(this.bosqueSeleccionado);
		} else {
			console.log('no encotnrado');
		}
	}
	parsearNumero(number: number) {
		const formattedNumber = new Intl.NumberFormat('es-ES', {
			minimumFractionDigits: 2, 
			maximumFractionDigits: 2,
		}).format(number);
		return formattedNumber;
	}
	volver() {
		this.mostrarTable = true;
	}
}
