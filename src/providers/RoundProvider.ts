import { IRound } from "../interfaces/IRound";
import { getLeagues, initializeLeagues } from "./LeagueProvider";

const __CACHE = new Map<string, IRound>();
const __COLLATOR = new Intl.Collator('de-DE');

type IsolatedRound = Omit<IRound, 'leagueId'>;

export const initializeRounds = async (): Promise<void> => {

  await initializeLeagues();

  if (__CACHE?.size) {
    console.error('Round cache already initialized.');
    return;
  }

  for (const [leagueIndex, league] of getLeagues()?.entries() ?? []) {

    const rounds: IsolatedRound[] = (await (await fetch(`./${league.path}rounds.json`)).json());

    for (const round of rounds ?? []) {
      __CACHE.set(round.ID, {
        ...round,
        leagueIndex
      });
    }

  }

};


export const getRounds = (): IRound[] => {

  if (!__CACHE?.size) {
    console.error('Round cache not initialized.');
    return;
  }

  return Array.from(__CACHE.values()).sort((a, b) => {
    return __COLLATOR.compare(a.Name, b.Name);
  });

};
