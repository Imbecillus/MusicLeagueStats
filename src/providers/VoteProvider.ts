import { IVote } from "../interfaces/IVote";
import { getLeagues, initializeLeagues } from "./LeagueProvider";
import { generateSubmissionId, getSubmission } from "./SubmissionProvider";

type RoundVotes = {
  round: string;
  votes: number;
  song: string;
};

let __CACHE: IVote[];
let __SCORE_CACHE: Map<string, number>;

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


const initializeScores = () => {

  __SCORE_CACHE = new Map();

  for (const vote of __CACHE) {

    if (vote["Points Assigned"] === 0) {
      continue;
    }

    const submission = getSubmission(
      generateSubmissionId(vote["Spotify URI"], vote["Round ID"])
    );

    if (__SCORE_CACHE.has(submission["Submitter ID"])) {
      __SCORE_CACHE.set(
        submission["Submitter ID"],
        __SCORE_CACHE.get(submission["Submitter ID"]) + vote["Points Assigned"]
      )
    } else {
      __SCORE_CACHE.set(
        submission["Submitter ID"],
        vote["Points Assigned"]
      )
    }

  }

}


export const getAllVotes = function* (): Generator<IVote> {

  if (!__CACHE?.length) {
    console.error('Vote cache not initialized.');
    return;
  }

  for (const vote of __CACHE) {
    yield vote;
  }

}


export const getHighestVote = (): [submissionId: string, voterId: string, points: number] => {

  if (!__CACHE?.length) {
    console.error('Vote cache not initialized.');
    return;
  }

  let song, round, voterId: string;
  let points: number = -Infinity;

  for (const vote of __CACHE) {

    if (vote["Points Assigned"] > points) {
      song = vote["Spotify URI"];
      round = vote["Round ID"];
      voterId = vote["Voter ID"];
      points = vote["Points Assigned"];
    }

  }

  return [generateSubmissionId(song, round), voterId, points];

}


export const getAllTimeBest = (): [highestPerson: string, highestScore: number] => {

  if (!__CACHE?.length) {
    console.error('Vote cache not initialized.');
    return;
  }

  if (!__SCORE_CACHE) {
    initializeScores();
  }

  let highestPerson: string;
  let highestScore: number = -Infinity;

  for (const [person, score] of __SCORE_CACHE.entries()) {

    if (score > highestScore) {
      highestScore = score;
      highestPerson = person;
    }

  }

  return [highestPerson, highestScore];

}


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

    const recipient = getSubmission(
      generateSubmissionId(vote["Spotify URI"], vote["Round ID"])
    )?.["Submitter ID"];

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

  const roundVotes = new Map<string, RoundVotes>();

  for (const vote of __CACHE) {

    const recipient = getSubmission(
      generateSubmissionId(vote["Spotify URI"], vote["Round ID"])
    )?.["Submitter ID"];

    if (recipient !== competitor) {
      continue;
    }

    if (roundVotes.has(vote["Round ID"])) {
      roundVotes.set(
        vote["Round ID"],
        {
          ...roundVotes.get(vote["Round ID"]),
          votes: roundVotes.get(vote["Round ID"]).votes + vote["Points Assigned"]
        }
      );
    } else {
      roundVotes.set(
        vote["Round ID"],
        {
          round: vote["Round ID"],
          song: vote["Spotify URI"],
          votes: vote["Points Assigned"]
        }
      );
    }

  }

  return Array.from(roundVotes.values()).sort((a, b) => b.votes - a.votes);

}
