import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { DataSet, DataPoint } from '../Models/data-source.model';
import { GinosaData } from '../Models/ginosa-data';
import { GrottaglieData } from '../Models/grottaglie-data';
import { MontemesolaData } from '../Models/montemesola-data';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  private allData: DataSet[] = [...GinosaData, ...GrottaglieData, ...MontemesolaData];
  // private currentDataSubject = new BehaviorSubject<DataPoint[]>([]);
  private selectedCitySubject = new BehaviorSubject<string>('Grottaglie');
  private selectedYearSubject = new BehaviorSubject<number>(2022);
  private selectedSeasonSubject = new BehaviorSubject<string>('estate');

  constructor() {    console.log('Initial allData:', this.allData);
  }
  

  setCity(city: string): void {
    console.log('Setting city:', city);
    this.selectedCitySubject.next(city);
  }

  setYear(year: number): void {
    console.log('Setting year:', year);
    this.selectedYearSubject.next(year);
  }

  setSeason(season: string): void {
    console.log('Setting season:', season);
    this.selectedSeasonSubject.next(season);
  }

  getCurrentData(): Observable<DataPoint[]> {
    return combineLatest([
      this.selectedCitySubject,
      this.selectedYearSubject,
      this.selectedSeasonSubject
    ]).pipe(
      map(([city, year, season]) => {
        const selectedDataSet = this.allData.find(
          set => set.city.toLowerCase() === city.toLowerCase() && set.year === year && set.season === (season === 'estate' ? 'summer' : 'winter')
        );
        console.log('Selected dataset:', selectedDataSet);
        return selectedDataSet ? selectedDataSet.data : [];
      })
    );
  }

  getSelectedCity(): Observable<string> {
    return this.selectedCitySubject.asObservable();
  }

  getSelectedYear(): Observable<number> {
    return this.selectedYearSubject.asObservable();
  }

  getSelectedSeason(): Observable<string> {
    return this.selectedSeasonSubject.asObservable();
  }

}