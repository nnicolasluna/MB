import { AfterViewInit, Component } from '@angular/core';
import { TopBarComponent } from "./components/top-bar/top-bar.component";
import * as L from 'leaflet';

@Component({
  selector: 'app-main',
  imports: [TopBarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements AfterViewInit {
  private map!: L.Map;
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
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
      }
    ).addTo(this.map);
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
}
