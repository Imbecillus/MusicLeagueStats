import { Component } from '@angular/core';
import { getCompetitors } from '../../providers/CompetitorProvider';
import { getTotalVotesCast, getVotesByCompetitors } from '../../providers/VoteProvider';
import { FunFactFansComponent, IFanData, IFanList } from '../funfact-fan-list/funfact_fan_list.component';

@Component({
  selector: 'app-fun-facts',
  standalone: true,
  imports: [FunFactFansComponent],
  templateUrl: './funfact.component.html',
  styleUrl: './funfact.component.scss'
})
export class FunFactComponent {

  fanData: IFanList;

  constructor() {
    const voters: IFanData[] = [];

    for (const competitor of getCompetitors()) {

      if (competitor.ID === '7b1c1e8f54e245b99c968ee64a491cf9') {
        continue;
      }

      const totalVotes = getTotalVotesCast(competitor.ID);
      const votesForTim = getVotesByCompetitors(competitor.ID, '7b1c1e8f54e245b99c968ee64a491cf9');

      voters.push({
        name: competitor.Name,
        percentage: votesForTim / totalVotes,
        percentageResolved: Math.round(votesForTim / totalVotes * 100),
        votes: votesForTim
      });

    }

    voters.sort((a, b) => b.percentage - a.percentage);
    
    this.fanData = {
      biggestFan: voters.at(0),
      biggestHater: voters.at(-1),
      between: voters.slice(1, -2)
    }

  }
  
}
