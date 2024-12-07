import { ICompetitor } from "../interfaces/ICompetitor";
import { getLeagues, initializeLeagues } from "./LeagueProvider";

const __CACHE = new Map<string, ICompetitor>();
const __COLLATOR = new Intl.Collator('de-DE');

export const initializeCompetitors = async (): Promise<void> => {

  await initializeLeagues();

  if (__CACHE?.size) {
    console.error('Competitor cache already initialized.');
    return;
  }

  for (const league of getLeagues() ?? []) {

    const competitors: ICompetitor[] = (await (await fetch(`./${league.path}competitors.json`))?.json()) ?? [];

    for (const competitor of competitors ?? []) {
      __CACHE.set(competitor.ID, competitor);
    }

  }

};


export const getCompetitors = (): ICompetitor[] => {

  if (!__CACHE?.size) {
    console.error('Competitor cache not initialized.');
    return;
  }

  return Array.from(__CACHE.values()).sort((a, b) => {
    return __COLLATOR.compare(a.Name, b.Name);
  });

};


export const getCompetitorName = (id: string): string => {

  if (!__CACHE?.size) {
    console.error('Competitor cache not initialized.');
    return;
  }

  return __CACHE.get(id).Name;

};
