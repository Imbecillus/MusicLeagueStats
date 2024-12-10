import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OrnamentComponent, OrnamentPath } from "../ornament/ornament.component";
import { NgFor } from '@angular/common';

const ornamentMap: Map<number, OrnamentPath> = new Map();

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, OrnamentComponent, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  ornamentPositions = [
    'pos-1', 'pos-2', 'pos-3', 'pos-4'
  ]

  getOrnament = (index: number): OrnamentPath => {

    if (ornamentMap.has(index)) {
      return ornamentMap.get(index);
    }

    const randomNumber = Math.floor(Math.random() * 6);
    let path: OrnamentPath;

    switch (randomNumber) {
      case 0: path = OrnamentPath.FLAKE; break;
      case 1: path = OrnamentPath.FLOWER; break;
      case 2: path = OrnamentPath.MISTLE; break;
      case 3: path = OrnamentPath.STRIPES; break;
      case 4: path = OrnamentPath.SWIRLS; break;
      case 5: path = OrnamentPath.TREE; break;
    }

    ornamentMap.set(index, path);
    return path;

  }

}
