import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-coordinacion',
  imports: [StepperModule, ButtonModule, CardModule, CommonModule],
  templateUrl: './coordinacion.component.html',
  styleUrl: './coordinacion.component.scss'
})
export class CoordinacionComponent {
  autoridades = [
    {
      "nombre": "Fondo Nacional de Desarrollo Forestal",
      "sigla": "",
      "cargo": "Director General Ejecutivo",
      "persona": "Delfín Reque Zurita"
    },
    {
      "nombre": "Dirección General de Gestión y Desarrollo Forestal",
      "sigla": "",
      "cargo": "Director General de Gestión y Desarrollo Forestal",
      "persona": "Filomon Hinojosa Torrico"
    },
    {
      "nombre": "Autoridad de Fiscalización y Control Social de Bosques y Tierra",
      "sigla": "",
      "cargo": "Director Ejecutivo",
      "persona": "Luis Roberto Flores Orellana"
    },
    {
      "nombre": "Viceministerio de Medio Ambiente, Biodiversidad, Cambios Climáticos y de Gestión y Desarrollo Forestal",
      "sigla": "",
      "cargo": "Viceministro de Medio Ambiente, Biodiversidad, Cambios Climáticos y de Gestión y Desarrollo Forestal",
      "persona": "Franz Alvaro Quispe Olivera"
    },
    {
      "nombre": "Autoridad Plurinacional de la Madre Tierra",
      "sigla": "",
      "cargo": "Directora Ejecutiva",
      "persona": "Angelica Ponce Chambi"
    },
    {
      "nombre": "Servicio Nacional de Áreas Protegidas",
      "sigla": "",
      "cargo": "Director General Ejecutivo",
      "persona": "Jair Gonzales Delgadillo"
    },
    {
      "nombre": "Museo Nacional de Historia Natural",
      "sigla": "",
      "cargo": "Director General Ejecutivo",
      "persona": "Hugo Aranibar Rojas"
    }
  ]


}
