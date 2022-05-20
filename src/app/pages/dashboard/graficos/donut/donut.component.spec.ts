import { DatePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ChartsModule } from "ng2-charts";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { ServiciosService } from "src/app/services/servicios.service";
import { DonutComponent } from "./donut.component";

fdescribe("DonutComponent", () => {
  let component: DonutComponent;
  let fixture: ComponentFixture<DonutComponent>;
  let servicio: ServiciosService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonutComponent],
      imports: [
        ChartsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BsDatepickerModule.forRoot(),
      ],
      providers: [ToastrService, DatePipe, BsLocaleService, ServiciosService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutComponent);
    servicio = TestBed.inject(ServiciosService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Donutcomponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnChanges", () => {
    let simpleChange: any;
    //Creamos nuestro espia para loadData
    const spyLoadData = spyOn(component, "loadData").and.callThrough();
    // Llamamos a nuestra funcion a evaluar
    component.ngOnChanges(simpleChange);
    // Validamos que nuestro espia fuera llamado
    expect(spyLoadData).toHaveBeenCalled();
  });

  it("Verificamos clear()", () => {
    const verifyMock: any = [[], []];
    component.clear();
    expect(component.doughnutChartData).toEqual(verifyMock);
  });

  it("Validamos nuestra funcion loadData()", () => {
    // Seteamos nuestra data de entrada
    component.Inicio = "2020/01/22";
    component.Fin = "2022/05/31";
    component.tramite1 = "EGRESADO";
    component.tramite2 = "TITULACION";
    // Creamos nuestro objeto respuesta mock
    const responseMock: any = [
      {
        registrado: "3",
        procesando: "5",
        observado: "2",
        finalizado: "3",
      },
    ];
    // Mockeamos el return de nuestro servicio
    const spyMock = spyOn(servicio, "buscarPie").and.returnValue(
      of(responseMock)
    );
    component.loadData();
    expect(spyMock).toHaveBeenCalled();
    // Validamos valores aro interior del grafico donut
    expect(component.doughnutChartData[0][0]).toEqual(
      responseMock[0].registrado
    );
    expect(component.doughnutChartData[0][1]).toEqual(
      responseMock[0].procesando
    );
    expect(component.doughnutChartData[0][2]).toEqual(
      responseMock[0].observado
    );
    expect(component.doughnutChartData[0][3]).toEqual(
      responseMock[0].finalizado
    );
    // Validamos valores aro exterior del grafico
    expect(component.doughnutChartData[1][0]).toEqual(
      responseMock[0].registrado
    );
    expect(component.doughnutChartData[1][1]).toEqual(
      responseMock[0].procesando
    );
    expect(component.doughnutChartData[1][2]).toEqual(
      responseMock[0].observado
    );
    expect(component.doughnutChartData[1][3]).toEqual(
      responseMock[0].finalizado
    );
  });
});
