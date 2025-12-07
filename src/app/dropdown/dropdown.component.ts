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

  activeTimeout = null;
  changes = new Set<DropdownOptionChange>();

  onOptionChange = (change: DropdownOptionChange) => {

    this.changes.add(change);

    clearTimeout(this.activeTimeout);

    this.activeTimeout = setTimeout(
      () => {
        const activeIds = this.filter === Filter.COMPETITORS
          ? this.chartFilterService.getActiveCompetitors()
          : this.chartFilterService.getActiveRounds();

        for (const c of this.changes.values()) {
          if (c[1]) {
            activeIds.add(c[0]);
          } else {
            activeIds.delete(c[0]);
          }
        }

        if (this.filter === Filter.COMPETITORS) {
          this.chartFilterService.updateActiveCompetitors(activeIds);
        } else {
          this.chartFilterService.updateActiveRounds(activeIds);
        }
      },
      750
    )

  }

}
