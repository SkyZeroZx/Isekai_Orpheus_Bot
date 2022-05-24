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

import { CreateTramiteComponent } from "./create-tramite.component";

fdescribe("CreateTramiteComponent", () => {
  let component: CreateTramiteComponent;
  let fixture: ComponentFixture<CreateTramiteComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;
  const mockInCreateDetalle: any = {
    apellidos: "PEREZ",
    estudiante: "ALFREDO",
    cod_est: "1615222287535",
    nombre: "JUAN",
    estado: "REGISTRADO",
    id_est_doc: "161522228753566",
    fecha_doc: "25/02/2023",
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTramiteComponent],
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
    fixture = TestBed.createComponent(CreateTramiteComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    component.in_NewTramite = mockInCreateDetalle;
  });

  it("CreateTramiteComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit()", () => {
    const spyCreateForms = spyOn(
      component,
      "createTramiteForms"
    ).and.callThrough();
    component.ngOnInit();
    expect(spyCreateForms).toHaveBeenCalled();
  });

  it("Verificamos registraEstado()", () => {
    const mockResponseOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spyCreateTramiteOK = spyOn(servicio, "createTramite").and.returnValue(
      of(mockResponseOK)
    );
    const spyEventEmitter = spyOn(
      component.respuestaRegistroTramite,
      "emit"
    ).and.callThrough();
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    let values = mockInCreateDetalle;
    component.ngOnInit();
    component.registraEstado(values);
    //Validamos las llamadas de nuestros espias
    expect(spyCreateTramiteOK).toHaveBeenCalled();
    expect(spyEventEmitter).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    //Validamos para el caso contrario que el servicio tenga un respuesta diferente de OK
    const mockResponseDF: any = {
      message: "Something",
    };
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyCreateTramiteDF = spyOn(servicio, "createTramite").and.returnValue(
      of(mockResponseDF)
    );
    component.ngOnInit();
    component.registraEstado(values);
    expect(spyCreateTramiteDF).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();

    // Verificamos para el caso el servicio  retorna un error
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();
    const spyCreateTramiteErr = spyOn(
      servicio,
      "createTramite"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.ngOnInit();
    component.registraEstado(values);
    expect(spyToastErr).toHaveBeenCalled();
    expect(spyCreateTramiteErr).toHaveBeenCalled();
  });

  it("Verificamos seleccionarArchivo(event)", () => {
    let event: any = {
      target: {
        files: ["DATA"],
      },
    };
    const dateReponse: any = {};
    const spyconvertFile = spyOn(component, "convertFile").and.returnValue(
      of(dateReponse)
    );
    component.createTramiteForms();
    component.seleccionarArchivo(event);
    expect(spyconvertFile).toHaveBeenCalled();
  });

  it("Verificamos upload()", () => {
    const mockResponseOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spyUploadFileOK = spyOn(servicio, "uploadFile").and.returnValue(
      of(mockResponseOK)
    );
    const spyEventEmitter = spyOn(
      component.respuestaRegistroTramite,
      "emit"
    ).and.callThrough();
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    component.ngOnInit();
    component.upload();
    //Validamos las llamadas de nuestros espias
    expect(spyUploadFileOK).toHaveBeenCalled();
    expect(spyEventEmitter).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    //Validamos para el caso contrario que el servicio tenga un respuesta diferente de OK
    const mockResponseDF: any = {
      message: "Something",
    };
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyCreateTramiteDF = spyOn(servicio, "uploadFile").and.returnValue(
      of(mockResponseDF)
    );
    component.ngOnInit();
    component.upload();
    expect(spyCreateTramiteDF).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();

    // Verificamos para el caso el servicio  retorna un error
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();
    const spyCreateTramiteErr = spyOn(servicio, "uploadFile").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    component.ngOnInit();
    component.upload();
    expect(spyToastErr).toHaveBeenCalled();
    expect(spyCreateTramiteErr).toHaveBeenCalled();
  });
});
