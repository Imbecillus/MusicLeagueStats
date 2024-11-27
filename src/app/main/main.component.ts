import { Component } from '@angular/core';
import { ChartHeatmapComponent } from "../chart-heatmap/chart-heatmap.component";
import { DataSelectorComponent } from "../data-selector/data-selector.component";
import { resolveHeatmapData } from '../../dataResolvers/HeatmapResolver';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ChartHeatmapComponent, DataSelectorComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  chartData: ApexAxisChartSeries;

  onFiltersChange = (activeCompetitors: Set<string>) => {

    console.log(activeCompetitors);

    this.chartData = resolveHeatmapData(activeCompetitors);

    console.log(this.chartData);

  }

}
