import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import { Label, SingleDataSet } from "ng2-charts";
import { DatosGrafico } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import { SpinnerService } from "src/app/services/spinner.service";

@Component({
  selector: "app-pie",
  templateUrl: "./pie.component.html",
  styleUrls: ["./pie.component.scss"],
})
export class PieComponent implements OnInit {
  @Input() Inicio: string;
  @Input() Fin: string;
  @Input() listaTramites:string[];
  listaDatos: DatosGrafico;

  tramite: string = null;

  constructor(private graficosService: ServiciosService) {}
  ngOnInit(): void {
 
  }

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
  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  loadData(): void {
    if (this.tramite && this.Inicio && this.Fin) {
      this.clear();
      let values = {
        "fechaInicio":this.Inicio,
        "fechaFin":this.Fin,
        "tramite":this.tramite
      }
      console.log('values PIE ' , values);
      this.graficosService
        .buscarPie(values)
        .subscribe((data) => { 
         // console.log('recibi en PIE' , data);
          this.pieChartData[0] = data[0].registrado;
          this.pieChartData[1] = data[0].procesando;
          this.pieChartData[2] = data[0].observado;
          this.pieChartData[3] = data[0].finalizado;
        });
    }
  }


  clear(): void {
    this.pieChartData = [];
  }
}
