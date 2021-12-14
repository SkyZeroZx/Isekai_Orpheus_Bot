import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss']
})
export class DonutComponent implements OnInit {
  @Input() Inicio:string;
  @Input() Fin:string;
  // Doughnut
  public doughnutChartLabels: Label[] = ['Registrados', 'Procesados', 'Observados', 'Finalizados'];
  public doughnutChartData: MultiDataSet = [
    [],
    []
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartPlugins = [];
  public doughnutChartColors: any = [
    {
      backgroundColor: [
        'rgba(78, 115, 223, 0.5)',
        'rgba(54, 185, 204, 0.5)',
        'rgba(231, 74, 59, 0.5)',
        'rgba(28, 200, 138, 0.5)'
      ]
    },
    {
      backgroundColor: [
        'rgba(78, 115, 223, 0.5)',
        'rgba(54, 185, 204, 0.5)',
        'rgba(231, 74, 59, 0.5)',
        'rgba(28, 200, 138, 0.5)'
      ]
    }
  ];

  countries: string[] = [];
  country1: string = null;
  country2: string = null;

  constructor(private graficosService: ServiciosService) { }

  ngOnInit(): void {
    this.getCountries();
  }

// Funcion que obtiene la keys del JSON para rellanar combobox
getCountries(): void {
  this.graficosService.getAll().subscribe(
    data => {
      this.countries = Object.keys(data);
    }
  );
}

// Funcion que limpiar la grafica
clear(): void {
  this.doughnutChartData = [];
  this.doughnutChartData.push([]);
  this.doughnutChartData.push([]);
}

// Funcion que carga datos al grafico seleccionar datos y/o realizar cambios en ellos
loadData(event: any): void {
  if(this.country1 && this.country2 && this.Inicio && this.Fin ){
    this.clear();
    //Asignar valores aro interior del grafico
    this.graficosService.buscarPie(this.country1, this.Inicio, this.Fin).subscribe(
      data => {
        const last = data.pop();  
        this.doughnutChartData[0][0] = last.registrado;
        this.doughnutChartData[0][1] = last.procesando;
        this.doughnutChartData[0][2] = last.observado;
        this.doughnutChartData[0][3]= last.finalizado;
      }
    );
  //Asignar valores aro exterior del grafico
    this.graficosService.buscarPie(this.country2, this.Inicio, this.Fin).subscribe(
      data => {
        const last = data.pop();   
        this.doughnutChartData[1][0] = last.registrado;
        this.doughnutChartData[1][1] = last.procesando;
        this.doughnutChartData[1][2] = last.observado;
        this.doughnutChartData[1][3]= last.finalizado;
      }
    );
  }
}
}
