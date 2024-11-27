import { Component, inject, Input } from '@angular/core';
import { IDropdown } from './interfaces/IDropdown';
import { DropdownOptionChange, DropdownOptionComponent } from "../dropdown-option/dropdown-option.component";
import { NgFor } from '@angular/common';
import { ChartFiltersService } from '../../services/chartFilters.service';
import { Filter } from '../data-selector/data-selector.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    DropdownOptionComponent,
    NgFor
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

  @Input() dropdown!: IDropdown;
  @Input() filter!: Filter;

  chartFilterService = inject(ChartFiltersService);

  onOptionChange = (change: DropdownOptionChange) => {

    const activeIds = this.filter === Filter.COMPETITORS
      ? this.chartFilterService.getActiveCompetitors()
      : this.chartFilterService.getActiveRounds();

    if (change[1]) {
      activeIds.add(change[0]);
    } else {
      activeIds.delete(change[0]);
    }

    if (this.filter === Filter.COMPETITORS) {
      this.chartFilterService.updateActiveCompetitors(activeIds);
    } else {
      this.chartFilterService.updateActiveRounds(activeIds);
    }

  }

}
