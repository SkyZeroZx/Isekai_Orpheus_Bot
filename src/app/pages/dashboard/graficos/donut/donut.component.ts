import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ChartType } from "chart.js";
import { Label, MultiDataSet } from "ng2-charts";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-donut",
  templateUrl: "./donut.component.html",
  styleUrls: ["./donut.component.scss"],
})
export class DonutComponent implements OnInit {
  // Obtenemos los valores de las fechas de inicio y fin apartir del componente padre dashboard asi como la listaTramites
  @Input() Inicio: string;
  @Input() Fin: string;
  @Input() listaTramites: string[];
  // Doughnut
  public doughnutChartLabels: Label[] = [
    "Registrados",
    "Procesados",
    "Observados",
    "Finalizados",
  ];
  public doughnutChartData: MultiDataSet = [[], []];
  public doughnutChartType: ChartType = "doughnut";
  public doughnutChartPlugins = [];
  public doughnutChartColors: any = [
    {
      backgroundColor: [
        "rgba(78, 115, 223, 0.5)",
        "rgba(54, 185, 204, 0.5)",
        "rgba(231, 74, 59, 0.5)",
        "rgba(28, 200, 138, 0.5)",
      ],
    },
    {
      backgroundColor: [
        "rgba(78, 115, 223, 0.5)",
        "rgba(54, 185, 204, 0.5)",
        "rgba(231, 74, 59, 0.5)",
        "rgba(28, 200, 138, 0.5)",
      ],
    },
  ];
  // Tramite seleccionados por el usuario para comparar
  tramite1: string = null;
  tramite2: string = null;

  constructor(private graficosService: ServiciosService) {}

  ngOnInit(): void {
    // This is intentional
  }
  // Si se detectan cambios se recarga el grafico
  ngOnChanges(_changes: SimpleChanges): void {
    this.loadData();
  }

  // Funcion que limpiar la grafica
  clear(): void {
    this.doughnutChartData = [];
    this.doughnutChartData.push([]);
    this.doughnutChartData.push([]);
  }

  // Funcion que carga datos al grafico seleccionar datos y/o realizar cambios en ellos
  loadData(): void {
    if (this.tramite1 && this.tramite2 && this.Inicio && this.Fin) {
      this.clear();
      let values1 = {
        fechaInicio: this.Inicio,
        fechaFin: this.Fin,
        tramite: this.tramite1,
      };
      let values2 = {
        fechaInicio: this.Inicio,
        fechaFin: this.Fin,
        tramite: this.tramite2,
      };
      //Asignar valores aro interior del grafico
      this.graficosService.buscarPie(values1).subscribe((data) => {
        this.doughnutChartData[0][0] = data[0].registrado;
        this.doughnutChartData[0][1] = data[0].procesando;
        this.doughnutChartData[0][2] = data[0].observado;
        this.doughnutChartData[0][3] = data[0].finalizado;
      });
      //Asignar valores aro exterior del grafico
      this.graficosService.buscarPie(values2).subscribe((data) => {
        this.doughnutChartData[1][0] = data[0].registrado;
        this.doughnutChartData[1][1] = data[0].procesando;
        this.doughnutChartData[1][2] = data[0].observado;
        this.doughnutChartData[1][3] = data[0].finalizado;
      });
    }
  }
}
