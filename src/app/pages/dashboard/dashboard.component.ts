import { Component, OnInit } from "@angular/core";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { listLocales } from "ngx-bootstrap/chronos";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { ServiciosService } from "src/app/services/servicios.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
 
  // Propiedades del grafico
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];
  public lineChartLabels: Label[] = [];

  listaTramites: string[] = [];
  minDate: Date;
  maxDate: Date;
  dashboardForm: FormGroup;
  constructor(
    private graficosService: ServiciosService,
    private localeService: BsLocaleService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicializamos el tipo de fecha y la restricciones de fecha para el datePicker
    this.localeService.use('es');
    this.minDate = new Date("2020-1-22");
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 15);
    this.getTramites();
    this.crearFormularioDashboard();
  }

  crearFormularioDashboard() {
    //Creamos validaciones respectiva para nuestro ReactiveForm
    this.dashboardForm = this.fb.group({
      dateInit: new FormControl(""),
      dateEnd: new FormControl(""),
      tramite: new FormControl(""),
    });
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
 
  getTramites() {
    this.graficosService.getAll().subscribe((data) => {
      this.listaTramites = Object.keys(data);
    });
  }

  ngOnChanges() {
    console.log("Esto ngOnChanges prueba");
  }

  loadData(): void {
 
    if (this.dashboardForm.getRawValue().dateInit && this.dashboardForm.getRawValue().dateEnd && this.dashboardForm.getRawValue().tramite) {
      forkJoin([
        this.graficosService
          .twoDates(
            this.dashboardForm.getRawValue().tramite,
            this.dashboardForm.getRawValue().dateInit,
            this.dashboardForm.getRawValue().dateEnd
          )
          .pipe(map((data) => data.map((val) => val.registrado))), //1
        this.graficosService
          .twoDates(
            this.dashboardForm.getRawValue().tramite,
            this.dashboardForm.getRawValue().dateInit,
            this.dashboardForm.getRawValue().dateEnd
          )
          .pipe(map((data) => data.map((val) => val.procesando))), //2
        this.graficosService
          .twoDates(
            this.dashboardForm.getRawValue().tramite,
            this.dashboardForm.getRawValue().dateInit,
            this.dashboardForm.getRawValue().dateEnd
          )
          .pipe(map((data) => data.map((val) => val.observado))), //3
        this.graficosService
          .twoDates(
            this.dashboardForm.getRawValue().tramite,
            this.dashboardForm.getRawValue().dateInit,
            this.dashboardForm.getRawValue().dateEnd
          )
          .pipe(map((data) => data.map((val) => val.finalizado))), //4
        this.graficosService
          .twoDates(
            this.dashboardForm.getRawValue().tramite,
            this.dashboardForm.getRawValue().dateInit,
            this.dashboardForm.getRawValue().dateEnd
          )
          .pipe(
            map((data) =>
              data.map((val) =>
                this.datePipe.transform(val.fecha, "dd/MM/YYYY")
              )
            )
          ), //5
      ]).subscribe(([data0, data1, data2, data3, data4]) => {
        console.log("Esto el graficio linea barra: es 1" + data0);
        console.log("Esto el graficio linea barra: es 2" + data1);
        console.log("Esto el graficio linea barra: es 3" + data2);
        console.log("Esto el graficio linea barra: es 4" + data3);
        console.log("Esto el graficio linea barra: es 5" , data4);
        this.lineChartData[0].data = data0;
        this.lineChartData[1].data = data1;
        this.lineChartData[2].data = data2;
        this.lineChartData[3].data = data3;
        this.lineChartLabels = data4;
      });
    }
  }

}
