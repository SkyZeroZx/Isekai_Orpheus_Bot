import { DatePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ChartsModule } from "ng2-charts";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { ServiciosService } from "src/app/services/servicios.service";
import { BarComponent } from "./bar.component";

fdescribe("BarComponent", () => {
  let component: BarComponent;
  let fixture: ComponentFixture<BarComponent>;
  let servicio: ServiciosService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarComponent],
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
    fixture = TestBed.createComponent(BarComponent);
    servicio = TestBed.inject(ServiciosService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("BarComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Validamos ngOnChanges(changes:SimpleChanges)", () => {
    let simpleChanges: any;
    const spyLoadData = spyOn(component, "loadData").and.callThrough();
    component.ngOnChanges(simpleChanges);
    expect(spyLoadData).toHaveBeenCalled();
  });

  it("Validamos clear()", () => {
    let arrVoid: any = [];
    component.clear();
    // Validamos que los valores sean vacio
    expect(component.barChartLabels).toEqual(arrVoid);
    for (let i = 0; i < component.barChartData.length; i++) {
      expect(component.barChartData[i].data).toEqual(arrVoid);
    }
  });

  it("Validamos loadData()", () => {
    // Creamos nuestro retorno para el servicio twoDates que sera usado por el componente
    const response = [
      {
        fecha: "2022/05/12",
        registrado: "1",
        procesando: "0",
        observado: "0",
        finalizado: "0",
      },
      {
        fecha: "2022/05/14",
        registrado: "0",
        procesando: "2",
        observado: "2",
        finalizado: "1",
      },
    ];
    component.tramite = "EGRESADO";
    component.Inicio = new Date("2022/05/14");
    component.Fin = new Date("2022/05/12");
    const spyClear = spyOn(component, "clear").and.callThrough();
    // Espiamos nuestro servicio twoMonths
    const spyTwoMonths = spyOn(servicio, "twoMonths").and.returnValue(
      of(response)
    );
    component.loadData();
    expect(spyTwoMonths).toHaveBeenCalled();
    expect(spyClear).toHaveBeenCalled();
    let verifyBarChartData: any[] = [
      { data: ["1", "0"], label: "Registrados" },
      { data: ["0", "2"], label: "Procesando" },
      { data: ["0", "2"], label: "Observados" },
      { data: ["0", "1"], label: "Finalizados" },
    ];
    const verifyBarChartLabels: any = ["2022/05/12", "2022/05/14"];
    // Verificamos valores de barChartData
    for (let i = 0; i < component.barChartData.length; i++) {
      expect(component.barChartData[i].data).toEqual(
        verifyBarChartData[i].data
      );
      expect(component.barChartData[i].label).toEqual(
        verifyBarChartData[i].label
      );
    }
    expect(component.barChartLabels).toEqual(verifyBarChartLabels);
  });
});
