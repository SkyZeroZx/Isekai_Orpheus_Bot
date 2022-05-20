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
import { DatosGrafico } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";

import { PieComponent } from "./pie.component";

fdescribe("PieComponent", () => {
  let component: PieComponent;
  let fixture: ComponentFixture<PieComponent>;
  let servicio: ServiciosService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieComponent],
      imports: [
        ChartsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BsDatepickerModule.forRoot(),
      ],
      providers: [
        ToastrService,
        DatePipe,
        BsLocaleService,
        ServiciosService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieComponent);
    servicio = TestBed.inject(ServiciosService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Piecomponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });
  it("Validamos loadData()", () => {
    // Mockeamos el response de buscarPie
    let mock: any = [
      {
        registrado: "3",
        procesando: "5",
        observado: "2",
        finalizado: "3",
      },
    ];
    // Seteamos data a las variables para preparar nuestra funcion
    component.tramite = "EGRESADO";
    component.Inicio = "2020/01/22";
    component.Fin = "2022/02/25";
    // creamos nuestro spyMock
    const spyMockPie = spyOn(servicio, "buscarPie").and.callFake(() => {
      return of(mock);
    });
    // espiamos nuestra funcion clear()
    const spyClear = spyOn(component,'clear').and.callThrough();
    // Llamamos nuestra funcion a evaluar
    component.loadData();
    // Validamos la llamadas a nuestros espias
    expect(spyMockPie).toHaveBeenCalled();
    expect(spyClear).toHaveBeenCalled();
  });
  
  it('Validamos clear()', () => {
    component.clear();
    expect(component.pieChartData).toEqual([]);
  })

  it('Validamos ngOnChanges(changes:SimpleChanges)', () => {
    let simpleChanges :any;
    const spyLoadData = spyOn(component, 'loadData').and.callThrough();
    component.ngOnChanges(simpleChanges);
    expect(spyLoadData).toHaveBeenCalled();
  })

});
