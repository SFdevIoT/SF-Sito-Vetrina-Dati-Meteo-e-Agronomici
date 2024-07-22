import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DataSourceGrottaglieService } from '../../../Services/data-source-grottaglie.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subscription } from 'rxjs';
import { DataManagementService } from 'src/app/Services/data-management.service';
import { DataPoint } from 'src/app/Models/data-source.model';








interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
  fixed?: boolean;    //proprietà che imposta una colonna fissa e non deselezionabile
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-tables-dashboard',
  standalone: false,
  templateUrl: './tables-dashboard.component.html',
  styleUrls: ['./tables-dashboard.component.css'],
})
export class TablesDashboardComponent implements OnInit, OnDestroy {

  dati!: DataPoint[]; // Assicurati di specificare il percorso corretto
  // dialogVisible: boolean = true;
  selectedData!: DataPoint[];
  cols!: Column[];
  selectedColumns!: Column[];
  exportColumns!: ExportColumn[];

  private subscription: Subscription | undefined;

  constructor(
    private dataService: DataManagementService,
    private cd: ChangeDetectorRef,

  ) { }


  ngOnInit() {

    this.subscription = this.dataService.getCurrentData().subscribe((data) => {      
  
      this.dati = data;
      this.selectedData = data;
      this.initializeColumns();
      this.cd.markForCheck();
    });

  }

     ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }


  private initializeColumns() {

    this.cols = [
      { field: 'DATA', header: 'Data' },
      { field: 'tempMedia', header: 'TMedia °C' },
      { field: 'tempMin', header: 'Tmin °C' },
      { field: 'tempMax', header: 'TMAX °C' },
      { field: 'puntoRugiada', header: 'PUNTO RUGIADA °C' },
      { field: 'umiditaRelativa', header: 'UMIDITA %' },
      { field: 'visibilitaKm', header: 'VISIBILITA km' },
      { field: 'ventoMediaSpeed', header: 'VENTO MEDIA km/h' },
      { field: 'ventoMaxSpeed', header: 'VENTO MAX km/h' },
      { field: 'pressioneSlm', header: 'PRESSIONE SLM mb' },
      { field: 'pioggiamm', header: 'PIOGGIA mm' },
      { field: 'precipitazioni', header: 'Precipitazioni' },
      { field: 'irraggiamento', header: 'Irraggiamento [Wh/m²]' },
      { field: 'Cultivar', header: 'Cultivar' },
      { field: 'giornoCultivar', header: 'giorno Cultivar' },
      { field: 'faseFenologica', header: 'Fase Fenologica' },
      { field: 'irrigazioni1', header: 'IRRIGAZIONI 1' },
      { field: 'irrigazioni2', header: 'IRRIGAZIONI 2' },
      { field: 'turnoIrriguoHmm', header: 'Turno irriguo H (mm)' },
      { field: 'turnoIrriguoHmm1', header: 'Turno irriguo H (mm)' },
      { field: 'et0', header: 'ET0' },
      { field: 'kc', header: 'kc' },
      { field: 'etc', header: 'Etc' },
      { field: 'etcHargPioggiaEffettiva', header: 'Etc Harg. - pioggia Effettiva' },
      { field: 'turnoIrrigoHarg', header: 'Turno irriguo Harg. (mm)' },
      { field: 'turnoIrrigoHarg1', header: 'Turno irriguo Harg. (mm)' },
    ];

this.selectedColumns = this.cols;
  

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,

    }));


  }


  private updateColumns() {
    // Aggiorna le colonne se necessario in base ai nuovi dati
  }




  //   exportPdf() {
  //     import('jspdf').then((jsPDF) => {
  //         import('jspdf-autotable').then((x) => {
  //             const doc = new jsPDF.default('p', 'px', 'a4');
  //             (doc as any).autoTable(this.exportColumns, this.dati);
  //             doc.save('dati_analitici.pdf');
  //         });
  //     });
  // }


  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.dati);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'analisidati');
    });
  }


  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(module => {
      const FileSaver = module.default;
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    });
  }
}