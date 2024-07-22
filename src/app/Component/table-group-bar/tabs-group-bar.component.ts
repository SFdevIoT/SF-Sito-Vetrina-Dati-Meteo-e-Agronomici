import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-group-bar',
  templateUrl: './tabs-group-bar.component.html',
  styleUrls: ['./tabs-group-bar.component.css'],
  standalone: false,
  // imports: [MatButtonToggleModule, SelectButtonModule, FormsModule],
})
export class TabsGroupBarComponent {
  activeButtonId: string | null = null;
  selectedCampaign: string = 'estate';

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

  handleButtonClick(id: string): void {
    this.activeButtonId = id;
    // Aggiungi qui la logica per gestire il click del pulsante
  }

  handleTabChange(index: number): void {
    console.log(`Tab changed: ${this.tabs[index].id}`);
    // Aggiungi qui la logica per gestire il cambio tab
  }
}