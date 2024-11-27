import { ILeague, ILeagues } from '../interfaces/ILeagues';


const __CACHE = new Map<number, ILeague>();

export const initializeLeagues = async (): Promise<void> => {

  if (__CACHE?.size) {
    return;
  }

  const leagues: ILeagues = (await (await fetch('./leagues.json')).json());

  for (const [index, league] of leagues?.leagues?.entries() ?? []) {
    __CACHE.set(index, league);
  }

};


export const getLeagues = (): ILeague[] => {

  if (!__CACHE?.size) {
    console.error('League cache not initialized.');
    return;
  }

  return Array.from(__CACHE.values());

};
