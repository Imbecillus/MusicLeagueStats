import { Component, ElementRef, ViewChild } from '@angular/core';
import { getCompetitors } from '../../providers/CompetitorProvider';
import { getTotalVotesCast, getVotesByCompetitors, getVotesPerRound } from '../../providers/VoteProvider';
import { FunFactFansComponent, IFanData, IFanList } from '../funfact-fan-list/funfact_fan_list.component';
import { FunFactSpotlight } from '../funfact-spotlight/funfact-spotlight.component';
import { getRoundById } from '../../providers/RoundProvider';
import { ICompetitor } from '../../interfaces/ICompetitor';
import { NgFor } from '@angular/common';

interface ISpotlight {

  title: string;
  headline: string;
  subline: string;

}

@Component({
  selector: 'app-your-wrapped',
  standalone: true,
  imports: [FunFactFansComponent, FunFactSpotlight, NgFor],
  templateUrl: './your-wrapped.component.html',
  styleUrl: './your-wrapped.component.scss'
})
export class YourWrappedComponent {

  competitors: ICompetitor[];

  @ViewChild('competitorSelection') competitorSelection!: ElementRef<HTMLSelectElement>;

  competitorId: string;

  fanData: IFanList;
  bestRound: ISpotlight;
  worstRound: ISpotlight;

  constructor() {

    this.competitors = getCompetitors();

    this.competitorId = this.competitors[0].ID;

    this.updateValues();

  }

  onSelectCompetitor = (): void => {

    this.competitorId = this.competitorSelection.nativeElement.value;

    console.log(this.competitorId)

    this.updateValues();

  }

  updateValues = () => {

    const voters: IFanData[] = [];

    for (const competitor of getCompetitors()) {

      if (competitor.ID === this.competitorId) {
        continue;
      }

      const totalVotes = getTotalVotesCast(competitor.ID);
      const votesForTim = getVotesByCompetitors(competitor.ID, this.competitorId);

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

    const rounds = getVotesPerRound(this.competitorId);

    console.log(rounds);

    this.bestRound = {
      headline: getRoundById(rounds.at(0)[0]).Name,
      subline: `${rounds.at(0)[1]} Votes`,
      title: 'Deine beste Runde'
    }

    this.worstRound = {
      headline: getRoundById(rounds.at(-1)[0]).Name,
      subline: `${rounds.at(-1)[1]} Votes`,
      title: 'Deine schlechteste Runde'
    }

  }

}