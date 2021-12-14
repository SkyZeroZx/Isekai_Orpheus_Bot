import { Component, Input, OnInit } from "@angular/core";
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
  @Input() Inicio: string;
  @Input() Fin: string;
  listaDatos: DatosGrafico[];
  countries: string[] = [];
  country: string = null;

  constructor(private graficosService: ServiciosService) {}

  ngOnInit(): void {
    this. getCountries();

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

  leerPrueba(estado, inicio, fin) {
    this.graficosService
      .buscarPie(estado, inicio, fin)
      .subscribe((res: DatosGrafico[]) => {
        this.listaDatos = res;
        console.log("res datos es " + res[0]["registrado"]);
        return res;
      });
  }

  /* loadData(event : any ):void{
    if(this.country && this.Inicio && this.Fin ){
      this.clear();
      this.graficosService.fromCountry(this.country).subscribe(
        data=>{
          const last =data.pop();
        //  this.n =this.graficosService.buscarPie( this.country , this.Inicio, this.Fin).pipe(map(data => data.map(val => val.registrado)));

        console.log("datos prueba grafico " + this.leerPrueba( this.country , this.Inicio, this.Fin)[0]['registrado']);
        this.pieChartData[0]=   this.leerPrueba( this.country , this.Inicio, this.Fin)[0]['registrado'];
        this.pieChartData[1]=this.leerPrueba( this.country , this.Inicio, this.Fin)[1]['procesando'];
        this.pieChartData[2]=this.leerPrueba( this.country , this.Inicio, this.Fin)[2]['observado'];
        this.pieChartData[3]=this.leerPrueba( this.country , this.Inicio, this.Fin)[3]['finalizado'];
        }
      );
    }
  }*/

  loadData(event: any): void {
    if (this.country && this.Inicio && this.Fin) {
      this.clear();
      this.graficosService
        .buscarPie(this.country, this.Inicio, this.Fin)
        .subscribe((data) => {
          const last = data.pop();

          this.pieChartData[0] = last.registrado;
          this.pieChartData[1] = last.procesando;
          this.pieChartData[2] = last.observado;
          this.pieChartData[3] = last.finalizado;
        });
    }
  }

  getCountries(): void {
    this.graficosService.getAll().subscribe((data) => {
      this.countries = Object.keys(data);
    });
  }
  clear(): void {
    this.pieChartData = [];
  }
}
