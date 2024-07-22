import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import dataGrottaglieAnno1Summer from '../../../Models/Grottaglie copy/dataArrayGrottaglie2021Summer';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-rainfall-fertigation-event',
  templateUrl: './rainfall-fertigation-event.component.html',
  styleUrls: ['./rainfall-fertigation-event.component.css']
})
export class RainfallFertigationEventComponent implements OnInit, AfterViewInit{
    @ViewChild('chart') chartCanvas!: ElementRef;
    private chart: Chart | undefined;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: any;
  
      ngOnInit() {
          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue('--text-color');
          const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
          const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
         
          
           // Filtra solo i dati con valori non null per Et0 ed Etc
           const filteredData = dataGrottaglieAnno1Summer.filter(obj => obj !== null);
   
           const fertigation1data = filteredData.map(obj => obj.irrigazioni1);
           const fertigation2data = filteredData.map(obj => obj.irrigazioni2);
           const hIrriguoData = filteredData.map(obj => obj.turnoIrriguoHmm);
           const hIrriguo1Data = filteredData.map(obj => obj.turnoIrriguoHmm1);
           const rainsData = filteredData.map(obj => obj.precipitazioni);

           const etcData = filteredData.map(obj => obj.etc);
 
        // const dateLabels= filteredData.map(obj => obj.DATA);


        this.data = {
          labels: dataGrottaglieAnno1Summer.map(obj => obj.DATA),
          datasets: [

                {
                  type: 'line',
                  label: 'Disonibilità 1',
                  borderColor: documentStyle.getPropertyValue('--yellow-500'),
                  borderWidth: 2,
                  fill: true,
                  tension: 0,
                  data: hIrriguoData,
                  pointRadius: 0.5, // Imposta il raggio del punto a 0 per nascondere i pallini
                },

                {
                  type: 'line',
                  label: 'Etc',
                  borderColor: documentStyle.getPropertyValue('--black-500'),
                  borderWidth: 2,
                  fill: true,
                  tension: 0,
                  data: etcData,
                  pointRadius: 0.5, // Imposta il raggio del punto a 0 per nascondere i pallini
              },

              {
                type: 'line',
                label: 'Disponibilità 2',
                borderColor: documentStyle.getPropertyValue('--green-500'),
                borderWidth: 2,
                fill: true,
                tension: 0,
                data: hIrriguo1Data,
                pointRadius: 0.5, // Imposta il raggio del punto a 0 per nascondere i pallini
            },
              
            {
              type: 'bar',
              label: 'IRRIGAZIONI 1',
              backgroundColor: documentStyle.getPropertyValue('--red-500'),
              data: fertigation1data,
              borderColor: 'black',
              borderWidth: 0.1
          },

          {
            type: 'bar',
            label: 'IRRIGAZIONI 2',
            backgroundColor: documentStyle.getPropertyValue('--orange-500'),
            data: fertigation2data,
            borderColor: 'black',
            borderWidth: 0.1
        },

              {
                  type: 'bar',
                  label: 'Precipitazioni',
                  backgroundColor: documentStyle.getPropertyValue('--gray-500'),
                  data: rainsData,
                  borderColor: 'black',
                  borderWidth: 0.1
              },

              
          ]
      };
      
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
                      maxTicksLimit: 13,
                      maxRotation: 90, // Imposta l'angolo massimo di rotazione
                      minRotation: 90  // Imposta l'angolo minimo di rotazione
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
                      display:true,
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
  }
