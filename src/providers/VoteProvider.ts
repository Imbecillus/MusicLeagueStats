import { IVote } from "../interfaces/IVote";
import { getLeagues, initializeLeagues } from "./LeagueProvider";
import { getSubmissionBySpotifyUri } from "./SubmissionProvider";

type RoundVotes = [round: string, votes: number];

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


export const getTotalVotesCast = (competitor: string, activeRounds?: Set<string>): number => {

  if (!__CACHE?.length) {
    console.error('Vote cache not initialized.');
    return;
  }

  let votes: number = 0;

  for (const vote of __CACHE) {

    if (activeRounds && !activeRounds.has(vote["Round ID"])) {
      continue;
    }

    if (vote["Voter ID"] !== competitor) {
      continue;
    }

    votes += vote["Points Assigned"];

  }

  return votes;

}


export const getVotesByCompetitors = (from: string, to: string, activeRounds?: Set<string>): number => {

  if (!__CACHE?.length) {
    console.error('Vote cache not initialized.');
    return;
  }

  let votes: number = 0;

  for (const vote of __CACHE) {

    if (activeRounds && !activeRounds.has(vote["Round ID"])) {
      continue;
    }

    if (vote["Voter ID"] !== from) {
      continue;
    }

    const recipient = getSubmissionBySpotifyUri(vote["Spotify URI"])["Submitter ID"];

    if (recipient !== to) {
      continue;
    }

    votes += vote["Points Assigned"];

  }

  return votes;

}


/**
 * Returns the (sorted) votes the competitor received per round.
 */
export const getVotesPerRound = (competitor: string): RoundVotes[] => {

  const roundVotes = new Map<string, number>();

  for (const vote of __CACHE) {

    const recipient = getSubmissionBySpotifyUri(vote["Spotify URI"])["Submitter ID"];

    if (recipient !== competitor) {
      continue;
    }

    if (roundVotes.has(vote["Round ID"])) {
      roundVotes.set(
        vote["Round ID"],
        roundVotes.get(vote["Round ID"]) + vote["Points Assigned"]
      );
    } else {
      roundVotes.set(
        vote["Round ID"],
        vote["Points Assigned"]
      );
    }

  }

  return Array.from(roundVotes.entries()).sort((a, b) => b[1] - a[1]);

}
