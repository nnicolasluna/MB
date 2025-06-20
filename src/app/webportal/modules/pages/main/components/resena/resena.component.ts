import { Component, model } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-resena',
  imports: [GalleriaModule

  ],
  templateUrl: './resena.component.html',
  styleUrl: './resena.component.scss'
})
export class ResenaComponent {
  images: any[] = [];

  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 3
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];


  ngOnInit() {
    this.images = [
      {
        itemImageSrc: 'assets/webportal/resena/resena1.jpg',
        thumbnailImageSrc: 'assets/webportal/resena/resena1.jpg',
        alt: 'Description 1',
        title: 'Title 1'
      },
      {
        itemImageSrc: 'assets/webportal/resena/resena2.jpg',
        thumbnailImageSrc: 'assets/webportal/resena/resena2.jpg',
        alt: 'Description 2',
        title: 'Title 2'
      },
      {
        itemImageSrc: 'assets/webportal/resena/resena3.jpg',
        thumbnailImageSrc: 'assets/webportal/resena/resena3.jpg',
        alt: 'Description 2',
        title: 'Title 2'
      },
    ];
  }
}
