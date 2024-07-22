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
export class TabsGroupBarComponent implements OnInit, OnDestroy {
  activeButtonId: string | null = null;
  selectedYear: string = '2022';
  selectedCampaign: string = 'estate';
  // selectedCity: string = 'Ginosa';

  private subscriptions: Subscription[] = [];



  buttons = [
    { label: 'Ginosa', id: 'ginosa' },
    { label: 'Grottaglie', id: 'grottaglie' },
    { label: 'Montemesola', id: 'montemesola' }
  ];

  tabs = [
    { label: '2021', id: '2021' },
    { label: '2022', id: '2022' }
  ];

  campaigns = [
    { label: 'Inverno', id: 'inverno', icon: 'pi-snowflake' },
    { label: 'Estate', id: 'estate', icon: 'pi-sun' }
  ];


  constructor(private dataService: DataManagementService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.dataService.getSelectedCity().subscribe(city => {
        this.activeButtonId = city.toLowerCase();
      }),
      this.dataService.getSelectedYear().subscribe(year => {
        this.selectedYear = year;
      }),
      this.dataService.getSelectedSeason().subscribe(season => {
        this.selectedCampaign = season;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleButtonClick(id: string): void {
    this.dataService.setCity(id);
  }

  handleTabChange(year: string): void {
    this.dataService.setYear(year);
  }

  handleCampaignChange(campaign: string): void {
    this.dataService.setSeason(campaign);
  }
}