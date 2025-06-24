import { Component } from '@angular/core';

@Component({
  selector: 'app-informacion',
  imports: [],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent {
  Seleccionado: any | undefined
  private readonly IMAGEN_INICIAL_SELECCIONADA: string = 'ABT Digital';
  datosAgencias = [
    {
      titulo: 'Sistema de Información y Monitoreo de Bosques (SIMB)',
      descripcion1: 'Tiene como propósito realizar el monitoreo permanente y sistemático sobre el estado de situación de los bosques a nivel nacional, para brindar información oficial y actualizada al pais, con el fin de constituirse como instancia técnica de monitoreo y gestión de información oficial.',
      descripcion2: '      Tiene como propósito realizar el monitoreo permanente y sistemático sobre el estado de situación de los bosques a nivel nacional, para brindar información oficial y actualizada al pais, con el fin de constituirse como instancia técnica de monitoreo y gestión de información oficial. El sistema esta dirigido a monitoreo el comportamiento del bosque, deforestación, focos de calor, cicatrices de quemas, incendios forestales y la forestación y reforestación del bosques, la plataforma SIMB permite generar reportes, monitorear y tomar acciones de prevencion en coordinacion con diversas instituciones.',
      imagen: 'assets/webportal/informacion/SIMB.png',
      direccion: 'http://datos.siarh.gob.bo/simb'
    },
    {
      titulo: 'Autoridad Plurinacional de la Madre Tierra SMTCC',
      descripcion1: 'El SMTCC tiene como objetivo principal recopilar, analizar, evaluar y difundir información  sobre el cambio climático y sus impactos en el país. Este sistema es parte integral de los esfuerzos de Bolivia para comprender y enfrentar los desafíos asociados al cambio climático, en línea con sus compromisos internacionales y su enfoque hacia en vivir bien y el respeto a los derechos de la Madre tierra',
      descripcion2: 'El sistema esta dirigido a brindar información sobre proyectos y programas que incorporan componentes de adaptación y mitigación al cambio climático',
      imagen: 'assets/webportal/informacion/SMTCC.png',
      direccion: 'https://devsmtcc.bits.bo/geocambioclimatico'
    },
    {
      titulo: 'ABT Digital',
      descripcion1: 'El sistema es como un centro de control para la conservación de nuestros bosques. Ayuda a los trabajadores del gobierno, a las empresas y a técnicos a hacer su trabajo más fácil y rápido. Además, permite que todos podamos ver información relevante sobre los bosques y la tierra',
      descripcion2: 'El sistema agiliza la gestión de trámites en todas sus etapas. Facilita la administración de información sobre propiedades y documentos legales, recopilando y analizando datos clave (derechos, regularización de desmontes, incendios, coberturas), generando mapas y gestionando la carga de documentos esenciales.',
      imagen: 'assets/webportal/informacion/ABT.png',
      direccion: 'http://abtdigital.gob.bo/geovisor'
    },
  ]
  ngOnInit(): void {
    this.mostrarInfo(this.IMAGEN_INICIAL_SELECCIONADA);
  }
  mostrarInfo(data: string) {
    this.Seleccionado = this.datosAgencias.find((agencia) => agencia.titulo === data);
  }
}
