import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataSet, DataPoint } from '../Models/data-source.model';
import { GinosaData } from '../Models/ginosa-data';
import { GrottaglieData } from '../Models/grottaglie-data';
import { MontemesolaData } from '../Models/montemesola-data';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  private allData: DataSet[] = [...GinosaData, ...GrottaglieData, ...MontemesolaData];
  private currentDataSubject = new BehaviorSubject<DataPoint[]>([]);
  private selectedCitySubject = new BehaviorSubject<string>('Grottaglie');
  private selectedYearSubject = new BehaviorSubject<string>('2022');
  private selectedSeasonSubject = new BehaviorSubject<string>('estate');

  constructor() {this.updateCurrentData();}

  setCity(city: string): void {
    this.selectedCitySubject.next(city);
    this.updateCurrentData();
  }

  setYear(year: string): void {
    this.selectedYearSubject.next(year);
    this.updateCurrentData();
  }

  setSeason(season: string): void {
    this.selectedSeasonSubject.next(season);
    this.updateCurrentData();
  }

  getCurrentData(): Observable<DataPoint[]> {
    return this.currentDataSubject.asObservable();
  }

  getSelectedCity(): Observable<string> {
    return this.selectedCitySubject.asObservable();
  }

  getSelectedYear(): Observable<string> {
    return this.selectedYearSubject.asObservable();
  }

  getSelectedSeason(): Observable<string> {
    return this.selectedSeasonSubject.asObservable();
  }

  private updateCurrentData(): void {
    const city = this.selectedCitySubject.value;
    const year = parseInt(this.selectedYearSubject.value);
    const season = this.selectedSeasonSubject.value === 'estate' ? 'summer' : 'winter';

    const selectedDataSet = this.allData.find(
      set => set.city === city && set.year === year && set.season === season
    );

    this.currentDataSubject.next(selectedDataSet ? selectedDataSet.data : []);
  }
}