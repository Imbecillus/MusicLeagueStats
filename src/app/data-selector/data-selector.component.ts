import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { IDropdown, IDropdownCol } from '../dropdown/interfaces/IDropdown';
import { IDropdownOption } from '../dropdown-option/interfaces/IDropdownOption';
import { getCompetitors } from '../../providers/CompetitorProvider';
import { ChartFiltersService } from '../../services/chartFilters.service';
import { getRounds } from '../../providers/RoundProvider';
import { getLeagues } from '../../providers/LeagueProvider';

export enum Filter {
  COMPETITORS = 'competitors',
  ROUNDS = 'rounds'
};


@Component({
  selector: 'app-data-selector',
  standalone: true,
  imports: [DropdownComponent],
  templateUrl: './data-selector.component.html',
  styleUrl: './data-selector.component.scss'
})
export class DataSelectorComponent {

  readonly COMPETITORS = Filter.COMPETITORS;
  readonly ROUNDS = Filter.ROUNDS;

  private chartFilters = inject(ChartFiltersService);
  dropdownCompetitors: IDropdown;
  dropdownRounds: IDropdown;

  constructor() {

    this.dropdownCompetitors = {
      columns: [{
        options: this.resolveCompetitorOptions()
      }],
      title: 'Teilnehmende'
    }

    this.dropdownRounds = {
      columns: this.resolveRoundOptions(),
      title: 'Runden'
    }

  }

  resolveCompetitorOptions = (): IDropdownOption[] => {

    return getCompetitors()?.map(competitor => {
      return {
        id: competitor.ID,
        title: competitor.Name
      };
    });

  }

  resolveRoundOptions = (): IDropdownCol[] => {

    const roundsOptions: IDropdownCol[] = [];

    for (const [index, league] of getLeagues()?.entries() ?? []) {

      const options = getRounds()
        ?.filter(rounds => rounds.leagueIndex === index)
        ?.map(rounds => {
          return {
            id: rounds.ID,
            title: rounds.Name
          }
        }) ?? [];

      roundsOptions.push({
        options,
        title: league.title
      });

    }

    return roundsOptions;

  }

  onCompetitorSelectionChange = (activeCompetitors: Set<string>): void => {
    this.chartFilters.updateActiveCompetitors(activeCompetitors);
  }

}
