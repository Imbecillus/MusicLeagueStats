import { Component, ElementRef, ViewChild } from '@angular/core';
import { getCompetitors } from '../../providers/CompetitorProvider';
import { getTotalVotesCast, getVotesByCompetitors, getVotesPerRound } from '../../providers/VoteProvider';
import { FunFactFansComponent, IFanData, IFanList } from '../funfact-fan-list/funfact_fan_list.component';
import { FunFactSpotlight } from '../funfact-spotlight/funfact-spotlight.component';
import { getRoundById } from '../../providers/RoundProvider';
import { ICompetitor } from '../../interfaces/ICompetitor';
import { NgFor } from '@angular/common';
import { ISpotlight } from '../../interfaces/ISpotlight';
import { getAvgCommentLengthFor, getLongestCommentFor } from '../../dataResolvers/AllTimeStatsResolver';
import { getSubmission, getSubmissionBySpotifyUri } from '../../providers/SubmissionProvider';

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
  avgCommentLength: ISpotlight;
  longestComment: ISpotlight;
  avgIntroductionLength: ISpotlight;
  longestIntroduction: ISpotlight;

  constructor() {

    this.competitors = getCompetitors();

    this.competitorId = this.competitors[0].ID;

    this.updateValues();

  }

  onSelectCompetitor = (): void => {

    this.competitorId = this.competitorSelection.nativeElement.value;

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

    this.bestRound = {
      headline: `${getRoundById(rounds.at(0).round).Name} (${getSubmissionBySpotifyUri(rounds.at(0).song)?.['Artist(s)']} — ${getSubmissionBySpotifyUri(rounds.at(0).song)?.Title})`,
      subline: `${rounds.at(0).votes} Punkte`,
      title: 'Deine beste Runde'
    }

    this.worstRound = {
      headline: `${getRoundById(rounds.at(-1).round).Name} (${getSubmissionBySpotifyUri(rounds.at(-1).song)?.['Artist(s)']} — ${getSubmissionBySpotifyUri(rounds.at(-1).song)?.Title})`,
      subline: `${rounds.at(-1).votes} Punkte`,
      title: 'Deine schlechteste Runde'
    }

    const avgCommentLength = getAvgCommentLengthFor(this.competitorId, 'other');

    this.avgCommentLength = {
      headline: `${Math.round(avgCommentLength)} Zeichen`,
      subline: 'war deine durchschnittliche Vote-Kommentar-Länge',
      title: 'Du hattest viel zu sagen!'
    }

    const longestComment = getLongestCommentFor(this.competitorId, 'other');
    const longestCommentSubmission = getSubmission(longestComment[0]);

    this.longestComment = {
      headline: `${longestCommentSubmission.Title} — ${longestCommentSubmission['Artist(s)']}`,
      subline: `${longestComment[1]} Zeichen hast du geschrieben! War es Lob oder Rant?`,
      title: 'Dein längster Kommentar'
    }

    const avgIntroductionLength = getAvgCommentLengthFor(this.competitorId, 'own');

    this.avgIntroductionLength = {
      headline: `${Math.round(avgIntroductionLength)} Zeichen`,
      subline: 'hast du im Schnitt zu deinen eigenen Songs geschrieben.',
      title: 'Ich erklär euch das mal.'
    }

    const longestIntroduction = getLongestCommentFor(this.competitorId, 'own');
    const longestIntroductionSubmission = getSubmission(longestIntroduction[0]);

    this.longestIntroduction = {
      headline: `${longestIntroductionSubmission.Title} — ${longestIntroductionSubmission['Artist(s)']}`,
      subline: `In ${longestIntroduction[1]} Zeichen hast du deine Liebe zum Ausdruck gebracht.`,
      title: 'Am wichtigsten war dir'
    }

  }

}
