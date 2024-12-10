import { Component } from '@angular/core';
import { NgIf } from '@angular/common'
import { ISpotlight } from '../../interfaces/ISpotlight';
import { FunFactSpotlight } from "../funfact-spotlight/funfact-spotlight.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FunFactSpotlight, NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  credits: ISpotlight = {
    title: '...und die schäbigste Codebase',
    headline: 'Timbecillus',
    subline: ''
  }

}
