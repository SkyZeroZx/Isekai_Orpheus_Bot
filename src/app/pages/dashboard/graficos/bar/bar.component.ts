import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import { ServiciosService } from 'src/app/services/servicios.service';
import { map } from 'rxjs/operators';
import { SpinnerService } from 'src/app/services/spinner.service';
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {
  @Input() Inicio:Date;
  @Input() Fin:Date;

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  tramites: string[] = [];
  tramite: string = null;

  constructor(private graficosService: ServiciosService,private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.getNameTramite();
   this.graficosService.twoDates('Egresado',new Date('2020-1-22') , new Date('2020-12-31')).subscribe(
      data=>{
        console.log('Grafico Barras');
        console.log(data);
      }
    )
  }

  // Configuracion Grafico de Barras
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Registrados' },
    { data: [], label: 'Procesando' },
    { data: [], label: 'Observados' },
    { data: [], label: 'Finalizados' }
  ];

  public barChartColors: Color[] = [
    {
      backgroundColor: 'rgba(78, 115, 223, 0.5)'
    },
    {
      backgroundColor: 'rgba(54, 185, 204, 0.5)'
    },
    {
      backgroundColor: 'rgba(231, 74, 59, 0.5)'
    },
    {
      backgroundColor: 'rgba(28, 200, 138, 0.5)'
    }
  ];
  
  public barChartOptions: ChartOptions = {
    responsive: true,
  };


  loadData(event: any): void {
    if (this.Inicio && this.Fin && this.tramite ) {
      this.clear();
      forkJoin([
        this.graficosService.twoMonths( this.tramite , this.Inicio,this.Fin).pipe(map(data => data.map(val => val.registrado))) ,//1
        this.graficosService.twoMonths(this.tramite , this.Inicio,this.Fin).pipe(map(data => data.map(val => val.procesando))),//2
        this.graficosService.twoMonths(this.tramite , this.Inicio,this.Fin).pipe(map(data => data.map(val => val.observado))),//3
        this.graficosService.twoMonths(this.tramite , this.Inicio,this.Fin).pipe(map(data => data.map(val => val.finalizado))),//4
          this.graficosService.twoMonths
          ( this.tramite ,this.Inicio,this.Fin).pipe(map(data => data.map(val => val.fecha))),//5
        ]).subscribe(( 
        [data0, data1, data2 ,data3 , data4]
      ) => {
        console.log("Fecha es "+ this.Inicio +" " + this.Fin)
        console.log("Bar es " + data0)
        this.barChartData[0].data=data0;
        this.barChartData[1].data=data1;
        this.barChartData[2].data=data2;
        this.barChartData[3].data=data3;
        this.barChartLabels=data4;
      });
    }
  }

  getNameTramite(): void {
    this.graficosService.getAll().subscribe(
      data => {
        this.tramites = Object.keys(data);
      }
    );
  }


  clear(): void {
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartLabels = [];
  }

}
