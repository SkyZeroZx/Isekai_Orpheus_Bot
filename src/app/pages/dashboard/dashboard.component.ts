import { Component, OnInit } from "@angular/core";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { listLocales } from "ngx-bootstrap/chronos";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { ServiciosService } from "src/app/services/servicios.service";
import { SpinnerService } from "src/app/services/spinner.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  locale = "es";
  locales = listLocales();
  public lineChartLabels: Label[] = [];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];

  pruebas: any[] = [];
  countries: string[] = [];
  country: string = null;
  dateInit: Date;
  dateEnd: Date;
  minDate: Date;
  maxDate: Date;
  // faCalendarAlt=faCalendarAlt;
  //faFile=faFile;
  constructor(
    private graficosService: ServiciosService,
    private localeService: BsLocaleService,
    private datePipe: DatePipe,
    private spinnerService: SpinnerService
  ) {
    this.getTramites();
    this.getPrueba();
    this.localeService.use(this.locale);
    this.minDate = new Date("2020-1-22");
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 15);

  }

  ngOnInit(): void {
  }

  public lineChartData: ChartDataSets[] = [
    { data: [], label: "Registrados" },
    { data: [], label: "Procesados" },
    { data: [], label: "Observados" },
    { data: [], label: "Finalizados" },
  ];

  public lineChartOptions: ChartOptions = {
    responsive: true,
  };

  public lineChartColors: Color[] = [
    {
      borderColor: "#4e73df",
      backgroundColor: "rgba(78, 115, 223, 0.3)",
    },
    {
      borderColor: "#36b9cc",
      backgroundColor: "rgba(54, 185, 204, 0.3)",
    },
    {
      borderColor: "#e74a3b",
      backgroundColor: "rgba(231, 74, 59, 0.3)",
    },
    {
      borderColor: "#1cc88a",
      backgroundColor: "rgba(28, 200, 138, 0.3)",
    },
  ];

  getPrueba() {
    this.graficosService.getAll().subscribe((pruebas) => {
      this.pruebas = pruebas;
    });
  }

  getTramites() {
    this.graficosService.getAll().subscribe((data) => {
      this.countries = Object.keys(data);
      console.log(this.countries);
    });
  }

  ngOnChanges() {
    console.log("Esto ngOnChanges prueba");
  }

 // numero: number;

  loadData(event: any): void {
    console.log(this.dateInit);
    if (this.dateInit && this.dateEnd && this.country) {
      forkJoin([
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.registrado))), //1
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.procesando))), //2
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.observado))), //3
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.finalizado))), //4
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(
            map((data) =>
              data.map((val) => this.datePipe.transform(val.fecha, "dd/MM"))
            )
          ), //5
      ]).subscribe(([data0, data1, data2, data3, data4]) => {
        console.log("Esto el graficio linea barra: es " + data0);
        this.lineChartData[0].data = data0;
        this.lineChartData[1].data = data1;
        this.lineChartData[2].data = data2;
        this.lineChartData[3].data = data3;
        this.lineChartLabels = data4;
      });
    }
  }

  prueba(): void {
    if (this.dateInit && this.dateEnd && this.country) {
      forkJoin([
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.registrado))), //1
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.procesando))), //2
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.observado))), //3
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(map((data) => data.map((val) => val.finalizado))), //4
        this.graficosService
          .twoDates(this.country, this.dateInit, this.dateEnd)
          .pipe(
            map((data) =>
              data.map((val) => this.datePipe.transform(val.fecha, "dd/MM"))
            )
          ), //5
      ]).subscribe(([data0, data1, data2, data3, data4]) => {
        this.lineChartData[0].data = data0;
        this.lineChartData[1].data = data1;
        this.lineChartData[2].data = data2;
        this.lineChartData[3].data = data3;
        this.lineChartLabels = data4;
      });
    }
  }
}
