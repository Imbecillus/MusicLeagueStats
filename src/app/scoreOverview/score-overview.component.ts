import { Component } from '@angular/core';
import { ChartHeatmapComponent } from "../chart-heatmap/chart-heatmap.component";
import { DataSelectorComponent } from "../data-selector/data-selector.component";

@Component({
  selector: 'app-score-overview',
  standalone: true,
  imports: [ChartHeatmapComponent, DataSelectorComponent],
  templateUrl: './score-overview.component.html',
  styleUrl: './score-overview.component.scss'
})
export class ScoreOverviewComponent { }
