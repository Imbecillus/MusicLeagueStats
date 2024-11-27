import { Injectable } from "@angular/core";
import { getCompetitors } from "../providers/CompetitorProvider";
import { BehaviorSubject, filter } from "rxjs";
import { getRounds } from "../providers/RoundProvider";

interface IActiveFilters {

  competitors: Set<string>;

  rounds: Set<string>;

}

@Injectable({
  providedIn: 'root'
})
export class ChartFiltersService {

  activeFiltersSubject: BehaviorSubject<IActiveFilters>;

  private activeFilters: IActiveFilters;

  constructor() {

    this.activeFilters = {
      competitors: new Set<string>(),
      rounds: new Set<string>()
    }

    // Start with all competitors enabled.
    for (const competitor of getCompetitors()) {
      this.activeFilters.competitors.add(competitor.ID);
    }

    // Start with all rounds enabled.
    for (const round of getRounds()) {
      this.activeFilters.rounds.add(round.ID);
    }

    this.activeFiltersSubject = new BehaviorSubject<IActiveFilters>(this.activeFilters);

  }

  public updateActiveCompetitors = (activeCompetitors: Set<string>) => {

    this.activeFilters.competitors = activeCompetitors;

    this.activeFiltersSubject.next(this.activeFilters);

  }

  public updateActiveRounds = (activeRounds: Set<string>) => {

    this.activeFilters.rounds = activeRounds;

    this.activeFiltersSubject.next(this.activeFilters);

  }

  public getActiveCompetitors = (): Set<string> => {
    return this.activeFilters.competitors;
  }

  public getActiveRounds = (): Set<string> => {
    return this.activeFilters.rounds;
  }

  public getCompetitorState = (id: string): boolean => {
    return this.activeFilters.competitors.has(id);
  }

  public getRoundState = (id: string): boolean => {
    return this.activeFilters.rounds.has(id);
  }

  public areAllCompetitorsSelected = (): boolean => {

    for (const competitor of getCompetitors()) {
      if (!this.activeFilters.competitors.has(competitor.ID)) {
        return false;
      }
    }

    return true;

  }

}
