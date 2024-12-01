import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fun-fact-spotlight',
  standalone: true,
  templateUrl: './funfact-spotlight.component.html',
  styleUrl: './funfact-spotlight.component.scss'
})
export class FunFactSpotlight {

  @Input() title: string;
  @Input() headline: string;
  @Input() subline: string;

}
