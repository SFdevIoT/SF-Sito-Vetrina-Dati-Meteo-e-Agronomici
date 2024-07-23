import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-group-bar',
  templateUrl: './tabs-group-bar.component.html',
  styleUrls: ['./tabs-group-bar.component.css'],
  standalone: false,
  // imports: [MatButtonToggleModule, SelectButtonModule, FormsModule],
})
export class TabsGroupBarComponent implements OnInit {
  activeButtonId: string | null = null;
  selectedYear: number = 2022;
  selectedCampaign: string = 'estate';
  // selectedCity: string = 'Ginosa';

  private subscriptions: Subscription[] = [];



  buttons = [
    { label: 'Ginosa', id: 'ginosa' },
    { label: 'Grottaglie', id: 'grottaglie' },
    { label: 'Montemesola', id: 'montemesola' }
  ];

  tabs = [
    { label: '2021', id: 2021 },
    { label: '2022', id: 2022 }
  ];

  campaigns = [
    { label: 'Inverno', id: 'inverno', icon: 'pi-snowflake' },
    { label: 'Estate', id: 'estate', icon: 'pi-sun' }
  ];


  constructor(private dataService: DataManagementService) {}

  ngOnInit() {
    this.dataService.getSelectedCity().subscribe(city => {
      console.log('Component received city:', city);

      this.activeButtonId = city;
    });
    this.dataService.getSelectedYear().subscribe(year => {
      console.log('Component received year:', year);

      this.selectedYear = year;
    });
    this.dataService.getSelectedSeason().subscribe(season => {
      console.log('Component received season:', season);

      this.selectedCampaign = season;
    });

    this.dataService.getCurrentData().subscribe(data => {
      console.log('Component received data:', data);
    });
  }

 

  handleButtonClick(id: string): void {
    console.log('Button clicked:', id);

    this.dataService.setCity(id);
  }

  handleTabChange(year: number): void {
    console.log('Tab changed:', year);

    this.dataService.setYear(year);
  }

  handleCampaignChange(campaign: string): void {
    console.log('Campaign changed:', campaign);

    this.dataService.setSeason(campaign);
  }
}