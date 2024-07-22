import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener, Input, OnDestroy } from '@angular/core';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-et0-etc-trend',
  templateUrl: './et0-etc-trend.component.html',
  styleUrls: ['./et0-etc-trend.component.css'],
})
export class Et0EtcTrendComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('chart') chartCanvas!: ElementRef<HTMLCanvasElement>;
    @Input() isPreview: boolean = false;
  
    private chart: Chart | undefined;
    private subscription: Subscription | undefined;
    data: ChartConfiguration<'line'>['data'] = { datasets: [] };
    options: ChartOptions<'line'> = {};
  
    constructor(private dataService: DataManagementService) {}

    ngOnInit() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
      this.subscription = this.dataService.getCurrentData().subscribe(data => {
        const filteredData = data.filter(obj => obj.Cultivar !== null);
        const etcData = filteredData.map(obj => obj.etc);
        const et0Data = filteredData.map(obj => obj.et0);
  
        this.data = {
          labels: filteredData.map(obj => obj.DATA),
          datasets: [
            {
              type: 'line' as const,
              label: 'Et0',
              data: et0Data,
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              backgroundColor: documentStyle.getPropertyValue('--blue-500') + '40',
              fill: true,
              tension: 0.4,
              pointRadius: 0.5,
              pointHoverRadius: 5,
              pointHitRadius: 10,
              pointBackgroundColor: documentStyle.getPropertyValue('--blue-500'),
              yAxisID: 'y',
            },
            {
              type: 'line' as const,
              label: 'Etc',
              data: etcData,
              borderColor: documentStyle.getPropertyValue('--orange-500'),
              fill: false,
              tension: 0,
              pointRadius: 0.5,
              yAxisID: 'y1',
            }
          ]
        };

        if (this.chart) {
          this.chart.data = this.data;
          this.chart.update();
        }
      });

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { size: 12 }
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              maxTicksLimit: 10,
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
            },
            grid: { color: surfaceBorder },
            title: {
              display: true,
              text: 'Data',
              color: textColor,
              font: { size: 12, weight: 'bold' }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              color: textColorSecondary,
              font: { size: 12 }
            },
            grid: { color: surfaceBorder },
            title: {
              display: true,
              text: 'Valore (mm)',
              color: textColor,
              font: { size: 12, weight: 'bold' }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: { color: textColorSecondary },
            grid: {
              drawOnChartArea: false,
              color: surfaceBorder
            }
          }
        }
      };
    }

    ngAfterViewInit() {
      this.createChart();
      this.updateChartOptions();
    }
  
    private updateChartOptions() {
      if (this.chart?.options?.scales?.['x']?.ticks) {
        const chartWidth = this.chartCanvas.nativeElement.clientWidth;
        const maxTicksLimit = Math.max(5, Math.floor(chartWidth / 50));
        this.chart.options.scales['x'].ticks.maxTicksLimit = maxTicksLimit;
        this.chart.update();
      }
    }
  
    @HostListener('window:resize')
    onResize() {
      this.updateChartOptions();
    }
  
    createChart() {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;
  
      if (this.isPreview) {
        if (this.options.scales?.['y']) {
          this.options.scales['y'].min = 0;
          this.options.scales['y'].max = Math.max(...this.data.datasets.flatMap(d => d.data as number[])) * 1.1;
        }
      }
  
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.data,
        options: this.options
      });
    }

    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
}