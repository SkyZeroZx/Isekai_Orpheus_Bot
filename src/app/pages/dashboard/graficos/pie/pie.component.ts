import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import { Label, SingleDataSet } from "ng2-charts";
import { DatosGrafico } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-pie",
  templateUrl: "./pie.component.html",
  styleUrls: ["./pie.component.scss"],
})
export class PieComponent implements OnInit {
  // Obtenemos los valores de las fechas de inicio y fin apartir del componente padre dashboard asi como la listaTramites
  @Input() Inicio: string;
  @Input() Fin: string;
  @Input() listaTramites: string[];
  listaDatos: DatosGrafico;

  tramite: string = null;

  constructor(private graficosService: ServiciosService) {}
  ngOnInit(): void {
    // This is intentional
  }
  //Opciones de ngChart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[] = [
    "Registrados",
    "Procesados",
    "Observados",
    "Finalizados",
  ];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: any = [
    {
      backgroundColor: [
        "rgba(78, 115, 223, 0.5)",
        "rgba(54, 185, 204, 0.5)",
        "rgba(231, 74, 59, 0.5)",
        "rgba(28, 200, 138, 0.5)",
      ],
    },
  ];
  // Si se detecta cambios se recarga el grafico uso de ngOnChanges
  ngOnChanges(_changes: SimpleChanges): void {
    this.loadData();
  }

  // Metodo para enviar los valores necesario a nuestro servicio y asignar los valores para nuestros grafico pie
  loadData(): void {
    if (this.tramite && this.Inicio && this.Fin) {
      this.clear();
      const values = {
        fechaInicio: this.Inicio,
        fechaFin: this.Fin,
        tramite: this.tramite,
      };
      this.graficosService.buscarPie(values).subscribe((data) => {
        this.pieChartData[0] = data[0].registrado;
        this.pieChartData[1] = data[0].procesando;
        this.pieChartData[2] = data[0].observado;
        this.pieChartData[3] = data[0].finalizado;
      });
    }
  }

  // Metodo para limpiar nuestra grafica
  clear(): void {
    this.pieChartData = [];
  }
}
