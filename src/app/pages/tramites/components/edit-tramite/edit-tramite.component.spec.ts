import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { Constant } from "src/app/Constants/Constant";
import { ReporteService } from "src/app/services/report.service";
import { ServiciosService } from "src/app/services/servicios.service";
import { EditTramiteComponent } from "./edit-tramite.component";

fdescribe("EditTramiteComponent", () => {
  let component: EditTramiteComponent;
  let fixture: ComponentFixture<EditTramiteComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;
  const mockInUpdateDetalle: any = {
    id_est_doc: "1615222287535",
    fecha: "25/02/2023",
    estado: "REGISTRADOS",
    observaciones: "NINGUNA",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTramiteComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        TabsModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        ServiciosService,
        ToastrService,
        ReporteService,
        FormBuilder,
        NgbActiveModal,
        NgbModal,
        ReactiveFormsModule,
        { provide: ToastrService, useClass: ToastrService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTramiteComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    component.in_updateDetalle = mockInUpdateDetalle;
  });

  it("EditTramiteComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit()", () => {
    // Espiamos las funciones que nos interesan
    const spycrearEstadoUpdateForm = spyOn(
      component,
      "crearEstadoUpdateForm"
    ).and.callThrough();
    const spydetalleUpdateTramite = spyOn(
      component,
      "detalleUpdateTramite"
    ).and.callThrough();
    // Llamamos nuestra funcion
    component.ngOnInit();
    // Validamos que nos espias fueran llamados
    expect(spycrearEstadoUpdateForm).toHaveBeenCalled();
    expect(spydetalleUpdateTramite).toHaveBeenCalled();
  });

  it("Verificamos detalleUpdateTramite()", () => {
    component.ngOnInit();
    component.detalleUpdateTramite();
    //Verificamos las asignaciones de valores
    expect(component.estadosActualizarForm.getRawValue().id_est_doc).toEqual(
      mockInUpdateDetalle.id_est_doc
    );
    expect(component.estadosActualizarForm.getRawValue().fecha).toEqual(
      mockInUpdateDetalle.fecha
    );
    expect(component.estadosActualizarForm.getRawValue().estado).toEqual(
      mockInUpdateDetalle.estado
    );
    expect(component.estadosActualizarForm.getRawValue().observaciones).toEqual(
      mockInUpdateDetalle.observaciones
    );
  });

  it("Verificamos ngOnChanges", () => {
    // Espiamos las funciones que nos interesan
    const spycrearEstadoUpdateForm = spyOn(
      component,
      "crearEstadoUpdateForm"
    ).and.callThrough();
    const spydetalleUpdateTramite = spyOn(
      component,
      "detalleUpdateTramite"
    ).and.callThrough();
    let changes: any;
    component.ngOnChanges(changes);
    // Validamos que nos espias fueran llamados
    expect(spycrearEstadoUpdateForm).toHaveBeenCalled();
    expect(spydetalleUpdateTramite).toHaveBeenCalled();
  });

  it("Verificamos actualizarEstadoTramite()", () => {
    const mockResponseOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spyUpdateStatusOK = spyOn(
      servicio,
      "updateStatusTramite"
    ).and.returnValue(of(mockResponseOK));
    //Espiamos nuestro servicio Toast Success
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    // Espiamos nuestro event emitter
    const spyEventEmitter = spyOn(
      component.respuestaUpdateTramite,
      "emit"
    ).and.callThrough();
    component.ngOnInit();
    component.actualizarEstadoTramite();
    //Validamos la llamada de nuestro espia y retorno de valor OK
    expect(spyUpdateStatusOK).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    expect(spyEventEmitter).toHaveBeenCalled();
    // Validamos para el caso que el servicio nos responsa diferente de OK
    const mockResponseDif: any = {
      message: "Something",
    };
    //Espiamos nuestro servicio Toast Error
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();
    // Hacemos que nuestro servicio nos retorne un valor diferente de OK
    const spyUpdateStatusDif = spyOn(
      servicio,
      "updateStatusTramite"
    ).and.returnValue(of(mockResponseDif));
    component.ngOnInit();
    component.actualizarEstadoTramite();
    //Validamos la llamada de nuestro espia
    expect(spyUpdateStatusDif).toHaveBeenCalled();
    expect(spyToastErr).toHaveBeenCalled();

    // Verificamos para el caso el servicio  retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyUpdateStatusErr = spyOn(
      servicio,
      "updateStatusTramite"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.ngOnInit();
    component.actualizarEstadoTramite();
    expect(spyToastError).toHaveBeenCalled();
    expect(spyUpdateStatusErr).toHaveBeenCalled();
  });
});
