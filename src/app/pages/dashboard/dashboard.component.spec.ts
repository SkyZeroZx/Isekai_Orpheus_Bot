import { DatePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ChartsModule } from "ng2-charts";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { ServiciosService } from "src/app/services/servicios.service";
import { DashboardComponent } from "./dashboard.component";
import { defineLocale, esLocale } from "ngx-bootstrap/chronos";
import { of } from "rxjs";

fdescribe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let servicio: ServiciosService;

  beforeEach(waitForAsync(() => {
    defineLocale("es", esLocale);
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        ChartsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BsDatepickerModule.forRoot(),
      ],
      providers: [
        ToastrService,
        DatePipe,
        BsLocaleService,
        ServiciosService,
        FormBuilder,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  // Preparamos el objeto a mockear
  const responseMockGraficos: any = {
    EGRESADO: [
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
    ],
    TITULACION: [],
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    servicio = TestBed.inject(ServiciosService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("DashboardComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit()", () => {
    // Espiamos nuestra funcion crearFormularioDashboard
    const spyCrearFormularioDashboard = spyOn(
      component,
      "crearFormularioDashboard"
    ).and.callThrough();
    // Espiamos nuestra funcion getTramites
    const spyGetTramites = spyOn(component, "getTramites").and.callThrough();
    // Llamamos nuestra funcion a evaluar
    component.ngOnInit();
    // Validamos que nuestro espia fuera llamado
    expect(spyCrearFormularioDashboard).toHaveBeenCalled();
    expect(spyGetTramites).toHaveBeenCalled();
  });

  it("Verificamos getTramites()", () => {
    // Mockeamos el reponse de nuestro servicio getAll
    const spyGraficosService = spyOn(servicio, "getAll").and.returnValues(
      of(responseMockGraficos)
    );
    // Llamamos a nuestra funcion a evaluar
    component.getTramites();
    // Validamos la llamada a nuestro espia y callFake
    expect(spyGraficosService).toHaveBeenCalled();
    // Validamos la asignacion de los valores de la variable listaTramites a las key de objeto
    expect(component.listaTramites).toEqual(Object.keys(responseMockGraficos));
  });

  it("Verificamos formattedDates", () => {
    // Inicializamos nuestro formulario
    component.crearFormularioDashboard();
    //Asigamos valores date a nuestros input dateInit y dateEnd
    component.dashboardForm.controls.dateInit.setValue(new Date("2020/02/01"));
    component.dashboardForm.controls.dateEnd.setValue(new Date("2023/02/01"));
    // Llamamos nuestra funcion que formatea las fechas las fechas
    component.formattedDates();
    expect(component.dashboardForm.getRawValue().dateInit).toEqual(
      "2020/02/01"
    );
    expect(component.dashboardForm.getRawValue().dateEnd).toEqual("2023/02/01");
  });

  it("Verificamos loadData():void", () => {
    // Creamos nuestro retorno para el servicio twoDates que sera usado por el componente
    const Response = [
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
    // Seteamos los valores para nuestro formulario
    component.dashboardForm.controls.dateInit.setValue(
      "Wed Jan 22 2020 00:02:15 GMT-0500 (hora estándar de Perú)"
    );
    component.dashboardForm.controls.dateEnd.setValue(
      "Tue May 31 2022 00:02:15 GMT-0500 (hora estándar de Perú)"
    );
    component.dashboardForm.controls.tramite.setValue("EGRESADO");
    // Espiamos nuestro servicio twoDates
    const spyTwoDates = spyOn(servicio, "twoDates").and.returnValue(
      of(Response)
    );
    // Objeto creado para validar valores de lineCharData del componente
    let verifyLineChartData: any[] = [
      { data: ["1", "0"], label: "Registrados" },
      { data: ["0", "2"], label: "Procesados" },
      { data: ["0", "2"], label: "Observados" },
      { data: ["0", "1"], label: "Finalizados" },
    ];
    // Llamamos a la funcion a evaluar
    component.loadData();
    // Verificamos que fuera llamada 5 veces nuestro servicio
    expect(spyTwoDates).toHaveBeenCalledTimes(5);
    // Verificamos valor de lineChartLabels
    expect(component.lineChartLabels).toEqual(["12/05/2022", "14/05/2022"]);
    // Verificamos valores de lineChartData
    for (let i = 0; i < component.lineChartData.length; i++) {
      expect(component.lineChartData[i].data).toEqual(
        verifyLineChartData[i].data
      );
      expect(component.lineChartData[i].label).toEqual(
        verifyLineChartData[i].label
      );
    }
  });
});
