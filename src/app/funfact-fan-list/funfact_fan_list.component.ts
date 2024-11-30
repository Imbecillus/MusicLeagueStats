import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface IFanData {

  name: string;
  votes: number;
  percentage: number;
  percentageResolved: number;

}

export interface IFanList {

  biggestFan: IFanData;
  biggestHater: IFanData;
  between: IFanData[];

}

@Component({
  selector: 'app-fun-fact-fans',
  standalone: true,
  imports: [NgFor],
  templateUrl: './funfact_fan_list.component.html',
  styleUrl: './funfact_fan_list.component.scss'
})
export class FunFactFansComponent {

  @Input() fanData: IFanList;

  expanded: boolean;
  
}
