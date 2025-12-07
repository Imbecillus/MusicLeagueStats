import { ISubmission } from "../interfaces/ISubmission";
import { getLeagues, initializeLeagues } from "./LeagueProvider";

const __CACHE = new Map<string, ISubmission>();

export const initializeSubmissions = async (): Promise<void> => {

  await initializeLeagues();

  if (__CACHE?.size) {
    console.error('Submission cache already initialized.');
    return;
  }

  for (const league of getLeagues() ?? []) {

    const submissions: ISubmission[] = (await (await fetch(`./${league.path}submissions.json`)).json());

    for (const submission of submissions ?? []) {
      __CACHE.set(
        generateSubmissionId(submission["Spotify URI"], submission["Round ID"]),
        submission
      );
    }

  }

};


export const generateSubmissionId = (spotifyUri: string, roundId: string): string => {
  return `${roundId}--${spotifyUri}`;
}


export const getAllSubmissions = (): ISubmission[] => {

  return Array.from(__CACHE.values());

};


export const getSubmission = (submissionId: string): ISubmission => {

  if (!__CACHE?.size) {
    console.error('Submission cache not initialized.');
    return;
  }

  return __CACHE.get(
    submissionId
  );

};


export const getSubmissionBySpotifyUri = (uri: string): ISubmission => {

  if (!__CACHE?.size) {
    console.error('Submission cache not initialized.');
    return;
  }

  for (const submission of __CACHE.values()) {
    if (submission["Spotify URI"] === uri) {
      return submission;
    }
  }

};
