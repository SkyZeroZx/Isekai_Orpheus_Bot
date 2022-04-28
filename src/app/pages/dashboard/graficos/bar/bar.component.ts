import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import { ServiciosService } from 'src/app/services/servicios.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {
  @Input() Inicio:Date;
  @Input() Fin:Date;
  @Input() listaTramites:string[];

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  tramite: string = null;

  constructor(private graficosService: ServiciosService) { }

  ngOnInit(): void {
    console.log('Lista Tramites Input');
    console.log(this.listaTramites)
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
        this.barChartData[0].data=data0;
        this.barChartData[1].data=data1;
        this.barChartData[2].data=data2;
        this.barChartData[3].data=data3;
        this.barChartLabels=data4;
      });
    }
  }
 


  clear(): void {
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartLabels = [];
  }

}
