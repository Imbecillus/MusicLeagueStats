import { IVote } from "../interfaces/IVote";
import { getLeagues, initializeLeagues } from "./LeagueProvider";
import { getSubmissionBySpotifyUri } from "./SubmissionProvider";


let __CACHE: IVote[];

export const initializeVotes = async (): Promise<void> => {

  await initializeLeagues();

  if (__CACHE?.length) {
    console.error('Vote cache already initialized.');
    return;
  }

  __CACHE = [];

  for (const league of getLeagues()) {

    __CACHE.push(
      ...(await (await fetch(`./${league.path}votes.json`))?.json()) ?? []
    );

  }

};


export const getVotesByCompetitors = (to: string, from: string, activeRounds?: Set<string>): number => {

  if (!__CACHE?.length) {
    console.error('Vote cache not initialized.');
    return;
  }

  let votes: number = 0;

  for (const vote of __CACHE) {

    if (activeRounds && !activeRounds.has(vote["Round ID"])) {
      continue;
    }

    if (vote["Voter ID"] !== to) {
      continue;
    }

    const recipient = getSubmissionBySpotifyUri(vote["Spotify URI"])["Submitter ID"];

    if (recipient !== from) {
      continue;
    }

    votes += vote["Points Assigned"];

  }

  return votes;

}
