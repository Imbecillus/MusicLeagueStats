import { Component, Input } from '@angular/core';

export enum OrnamentPath {
  SWIRLS = '/images/orna-1.webp',
  TREE = '/images/orna-2.webp',
  STRIPES = '/images/orna-3.webp',
  MISTLE = '/images/orna-4.webp',
  FLOWER = '/images/orna-5.webp',
  FLAKE = '/images/orna-6.webp'
}

@Component({
  selector: 'app-ornament',
  standalone: true,
  imports: [],
  templateUrl: './ornament.component.html',
  styleUrl: './ornament.component.scss'
})
export class OrnamentComponent {

  @Input() path: OrnamentPath;
  @Input() pos: string;

}
