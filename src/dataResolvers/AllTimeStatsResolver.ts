import { getCompetitorName } from "../providers/CompetitorProvider";
import { getSubmissionBySpotifyUri } from "../providers/SubmissionProvider";
import { getAllVotes } from "../providers/VoteProvider";

interface IDisplayableSubmission {

  songTitle: string;

  artistName: string;

  submitterName: string;

  score: number;

}

const __SUBMISSION_SCORES: Map<string, number> = new Map();

const initializeCache = (): void => {

  if (__SUBMISSION_SCORES.size) {
    __SUBMISSION_SCORES.clear();
  }

  // Initialize map of all submissions and their scores.
  for (const vote of getAllVotes()) {

    const spotifyUri = vote["Spotify URI"];

    if (__SUBMISSION_SCORES.get(spotifyUri)) {
      __SUBMISSION_SCORES.set(
        spotifyUri,
        __SUBMISSION_SCORES.get(spotifyUri) + vote["Points Assigned"]
      )
    } else {
      __SUBMISSION_SCORES.set(
        spotifyUri,
        vote["Points Assigned"] ?? 0
      );
    }

  }

}

export const getBestAndWorstSubmission = (): [best: IDisplayableSubmission, worst: IDisplayableSubmission] => {

  if (!__SUBMISSION_SCORES.size) {
    initializeCache();
  }

  console.log(__SUBMISSION_SCORES);

  let bestUri: [string, number] = ['', -Infinity];
  let worstUri: [string, number] = ['', Infinity];

  for (const [uri, votes] of __SUBMISSION_SCORES.entries()) {

    if (votes < worstUri[1]) {
      worstUri = [uri, votes];
    }

    if (votes > bestUri[1]) {
      bestUri = [uri, votes];
    }

  }

  const bestSong = getSubmissionBySpotifyUri(bestUri[0]);
  const worstSong = getSubmissionBySpotifyUri(worstUri[0]);

  return [
    {
      artistName: bestSong["Artist(s)"],
      score: bestUri[1],
      songTitle: bestSong.Title,
      submitterName: getCompetitorName(bestSong["Submitter ID"])
    },
    {
      artistName: worstSong["Artist(s)"],
      score: worstUri[1],
      songTitle: worstSong.Title,
      submitterName: getCompetitorName(worstSong["Submitter ID"])
    }
  ];

};
