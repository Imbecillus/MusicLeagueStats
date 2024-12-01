import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { resolveHeatmapData } from '../../dataResolvers/HeatmapResolver';
import { ChartFiltersService } from '../../services/chartFilters.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-heatmap',
  standalone: true,
  imports: [],
  templateUrl: './chart-heatmap.component.html',
  styleUrl: './chart-heatmap.component.scss'
})
export class ChartHeatmapComponent implements AfterViewInit, OnInit {

  @ViewChild('chart') containerElement!: ElementRef;

  private chart: ApexCharts;
  private filterSubscription: Subscription;

  constructor(private chartFiltersService: ChartFiltersService) { }
  
  public ngOnInit(): void {

    this.filterSubscription = this.chartFiltersService.activeFiltersSubject.subscribe(
      filters => {
        this.chart?.updateSeries(
          resolveHeatmapData(
            filters.competitors,
            filters.rounds
          )
        )
      }
    )

  }

  public ngAfterViewInit(): void {

    const element = this.containerElement.nativeElement;

    this.chart = new ApexCharts(element, {
      chart: {
        height: 700,
        type: 'heatmap',
        toolbar: {
          show: false
        }
      },
      series: resolveHeatmapData(this.chartFiltersService.getActiveCompetitors()),
      dataLabels: {
        enabled: true
      },
      colors: ["#ca7373"],
      xaxis: {
        position: 'top',
        tooltip: {
          formatter: (name) => `von ${name}`
        },
        labels: {
          rotate: 45,
          rotateAlways: true,
          offsetY: 110,
          trim: true
        }
      },
      tooltip: {
        y: {
          title: {
            formatter: (seriesName) => `an ${seriesName}`
          }
        }
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            inverse: false
          },
          distributed: false
        }
      }
    });
    this.chart.render();

  };

}
