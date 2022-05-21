import { Component, OnInit} from "@angular/core";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
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
    this.localeService.use("es");
    // Restricciones para fecha maxima y minima de seleccion en el DatePicker
    this.minDate = new Date("2020-1-22");
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 15);
    //Obtenemos los tramites para el selector de tramites
    this.getTramites();
    //Creamos nuestro formulario al renderizar el componente
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
  //  Configuraciones de ngCharts
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
    // Apartir del servicio obtenemos las key de los arreglos
    this.graficosService.getAll().subscribe((data) => {
      this.listaTramites = Object.keys(data);
    });
  }

  // Metodo que carga la data correspondiente para el grafico de lineas
  loadData(): void {
    // Validamos que exista data para enviar las peticiones a nuestro servicio
    if (
      this.dashboardForm.getRawValue().dateInit &&
      this.dashboardForm.getRawValue().dateEnd &&
      this.dashboardForm.getRawValue().tramite
    ) {
    //Formateamos la fecha previamente antes de enviarlo
      this.formattedDates();
      // Lllamada al servicio de grafico y asigamos los arreglos correspondientes segun el los estados
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
        // Asigamos los valores al grafico de lineas
        console.log(data0, data1, data2, data3, data4);
        this.lineChartData[0].data = data0;
        this.lineChartData[1].data = data1;
        this.lineChartData[2].data = data2;
        this.lineChartData[3].data = data3;
        this.lineChartLabels = data4;
      });
    }
  }

  formattedDates() {
    this.dashboardForm.controls.dateInit.setValue(
      this.datePipe.transform(
        this.dashboardForm.getRawValue().dateInit,
        "YYYY/MM/dd"
      )
    );
    this.dashboardForm.controls.dateEnd.setValue(
      this.datePipe.transform(
        this.dashboardForm.getRawValue().dateEnd,
        "YYYY/MM/dd"
      )
    );
  }
}
