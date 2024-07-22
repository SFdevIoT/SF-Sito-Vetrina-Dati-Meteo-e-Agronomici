import { AfterViewInit, Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild,Inject, PLATFORM_ID } from '@angular/core';
import { Chart } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-precipitation',
  templateUrl: './precipitation.component.html',
  styleUrls: ['./precipitation.component.css']
})
export class PrecipitationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | undefined;
  private subscription: Subscription | undefined;

  data: any;
  options: any;

  constructor(private dataService: DataManagementService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.subscription = this.dataService.getCurrentData().subscribe(data => {
      // Qui elaboriamo i dati per il grafico delle precipitazioni
      // Per questo esempio, calcoliamo le medie mensili
      const monthlyData = this.calculateMonthlyAverages(data);

      this.data = {
        labels: ['APRILE', 'MAGGIO', 'GIUGNO', 'LUGLIO', 'AGOSTO', 'SETTEMBRE'],
        datasets: [
          {
            type: 'line',
            label: 'Etc',
            borderColor: documentStyle.getPropertyValue('--black-700'),
            borderWidth: 4,
            fill: true,
            tension: 0,
            data: monthlyData.etcAverages
          },
          {
            type: 'bar',
            label: 'Precipitazioni',
            backgroundColor: documentStyle.getPropertyValue('--orange-500'),
            data: monthlyData.precipitationAverages,
            borderColor: 'black',
            borderWidth: 3
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
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
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
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.createChart();
  }
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

  private calculateMonthlyAverages(data: any[]): { precipitationAverages: number[], etcAverages: number[] } {
    const months = [4, 5, 6, 7, 8, 9]; // Aprile a Settembre
    const precipitationAverages = [];
    const etcAverages = [];

    for (const month of months) {
      const monthData = data.filter(item => new Date(item.DATA).getMonth() + 1 === month);
      const precipitationAvg = monthData.reduce((sum, item) => sum + item.precipitazioni, 0) / monthData.length;
      const etcAvg = monthData.reduce((sum, item) => sum + item.etc, 0) / monthData.length;
      
      precipitationAverages.push(Number(precipitationAvg.toFixed(2)));
      etcAverages.push(Number(etcAvg.toFixed(2)));
    }

    return { precipitationAverages, etcAverages };
  }
}