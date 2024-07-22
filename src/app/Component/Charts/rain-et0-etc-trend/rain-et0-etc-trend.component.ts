import { AfterViewInit, Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rain-et0-etc-trend',
  templateUrl: './rain-et0-etc-trend.component.html',
  styleUrls: ['./rain-et0-etc-trend.component.css']
})
export class RainEt0EtcTrendComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart') chartCanvas!: ElementRef;
  private chart: Chart | undefined;
  private subscription: Subscription | undefined;

  data: any;
  options: any;

  constructor(private dataService: DataManagementService) {}

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.subscription = this.dataService.getCurrentData().subscribe(data => {
      const filteredData = data.filter(obj => obj.Cultivar !== null);
      const rainsData = filteredData.map(obj => obj.precipitazioni);
      const etcData = filteredData.map(obj => obj.etc);
      const et0Data = filteredData.map(obj => obj.et0);

      this.data = {
        labels: filteredData.map(obj => obj.DATA),
        datasets: [
          {
            type: 'bar',
            label: 'Precipitazioni',
            backgroundColor: documentStyle.getPropertyValue('--orange-500'),
            data: rainsData,
            borderColor: 'black',
            borderWidth: 0.3
          },
          {
            type: 'line',
            label: 'Et0',
            borderColor: documentStyle.getPropertyValue('--green-500'),
            borderWidth: 2,
            fill: true,
            tension: 0,
            data: et0Data,
            pointRadius: 0.3,
          },
          {
            type: 'line',
            label: 'Etc',
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            borderWidth: 2,
            fill: false,
            tension: 0,
            data: etcData,
            pointRadius: 0.3,
          },
        ]
      };

      if (this.chart) {
        this.chart.data = this.data;
        this.chart.update();
      }
    });
    
    this.options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            maxTicksLimit: 6,
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: surfaceBorder
          },
          scaleLabel: {
            display: true,
            labelString: 'Precipitazioni mm',
            color: textColor,
            font: {
              weight: 'bold'
            }
          }
        }
      }
    };
  }

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            ...this.options.scales,
            x: {
              ...this.options.scales.x,
              ticks: {
                ...this.options.scales.x.ticks,
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        }
      });
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}