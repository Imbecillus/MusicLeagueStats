import { Component } from '@angular/core';
import { FunFactSpotlight } from '../funfact-spotlight/funfact-spotlight.component';
import { getBestAndWorstSubmission, getMostAndLeastWordyCommenter } from '../../dataResolvers/AllTimeStatsResolver';
import { ISpotlight } from '../../interfaces/ISpotlight';
import { getAllTimeBest, getHighestVote } from '../../providers/VoteProvider';
import { getCompetitorName } from '../../providers/CompetitorProvider';
import { getSubmissionBySpotifyUri } from '../../providers/SubmissionProvider';


@Component({
  selector: 'app-everything-wrapped',
  standalone: true,
  imports: [FunFactSpotlight],
  templateUrl: './everything-wrapped.component.html',
  styleUrl: './everything-wrapped.component.scss'
})
export class EverythingWrappedComponent {

  bestSong: ISpotlight;
  worstSong: ISpotlight;
  highestVote: ISpotlight;
  allTimeBest: ISpotlight;
  mostWordyCommenter: ISpotlight;
  leastWordyCommenter: ISpotlight;
  mostWordyIntroductions: ISpotlight;
  leastWordyIntroductions: ISpotlight;

  constructor() {

    const [bestSubmission, worstSubmission] = getBestAndWorstSubmission();

    this.bestSong = {
      headline: `${bestSubmission.songTitle} — ${bestSubmission.artistName}`,
      subline: `von ${bestSubmission.submitterName} (${bestSubmission.score} Punkte)`,
      title: 'Beste Einreichung'
    };

    this.worstSong = {
      headline: `${worstSubmission.songTitle} — ${worstSubmission.artistName}`,
      subline: `von ${worstSubmission.submitterName} (${worstSubmission.score} Punkte)`,
      title: 'Schäbigste Einreichung'
    };

    const highestVote = getHighestVote();
    const highestVoteSong = getSubmissionBySpotifyUri(highestVote[0]);
    const highestVoter = getCompetitorName(highestVote[1]);

    this.highestVote = {
      headline: `${highestVote[2]} Punkte`,
      subline: `von ${highestVoter} an ${highestVoteSong.Title}`,
      title: 'Höchste vergebene Punktzahl'
    };

    const [highestPersonId, highestScore] = getAllTimeBest();

    this.allTimeBest = {
      headline: getCompetitorName(highestPersonId),
      subline: `${highestScore} Punkte`,
      title: 'Insgesamt die meisten Punkte'
    };

    const [mostWordyCommenter, leastWordyCommenter] = getMostAndLeastWordyCommenter('other');

    this.mostWordyCommenter = {
      headline: mostWordyCommenter.commenterName,
      subline: `Durchschnittlich ${Math.round(mostWordyCommenter.avgLength)} Zeichen pro Kommentar`,
      title: 'Feuilletonist*in'
    };

    this.leastWordyCommenter = {
      headline: leastWordyCommenter.commenterName,
      subline: `Durchschnittlich ${Math.round(leastWordyCommenter.avgLength)} Zeichen pro Kommentar`,
      title: 'Kein Mensch der vielen Worte'
    };

    const [mostWordyIntroductions, leastWordyIntroductions] = getMostAndLeastWordyCommenter('own');

    this.mostWordyIntroductions = {
      headline: mostWordyIntroductions.commenterName,
      subline: `Durchschnittlich ${Math.round(mostWordyIntroductions.avgLength)} Zeichen über die eigenen Songs`,
      title: 'Radiomoderator*in'
    };

    this.leastWordyIntroductions = {
      headline: leastWordyIntroductions.commenterName,
      subline: `Durchschnittlich ${Math.round(leastWordyIntroductions.avgLength)} Zeichen über die eigenen Songs`,
      title: 'Das steht für sich.'
    };

  }

}
