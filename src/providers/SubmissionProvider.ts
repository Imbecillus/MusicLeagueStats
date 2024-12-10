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
      __CACHE.set(submission["Spotify URI"], submission);
    }

  }

};


export const getAllSubmissions = (): ISubmission[] => {

  return Array.from(__CACHE.values());

};


export const getSubmissionBySpotifyUri = (spotifyUri: string): ISubmission => {

  if (!__CACHE?.size) {
    console.error('Submission cache not initialized.');
    return;
  }

  return __CACHE.get(spotifyUri);

};
