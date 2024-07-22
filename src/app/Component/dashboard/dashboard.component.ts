import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { TabsGroupBarComponent } from '../table-group-bar/tabs-group-bar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  
})
export class DashboardComponent {
  selectedChart: string = 'et0-etc';
  isFullscreenVisible: boolean = false;
  fullscreenType: 'table' | 'chart' = 'chart';

  selectChart(chartType: string) {
    this.selectedChart = chartType;

}

openFullscreen(type: 'table' | 'chart') {
  this.fullscreenType = type;
  this.isFullscreenVisible = true;
}
}