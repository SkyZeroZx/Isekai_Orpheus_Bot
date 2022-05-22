import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { ServiciosService } from "src/app/services/servicios.service";
import { DetalleTramiteComponent } from "./detalle-tramite.component";

fdescribe("DetalleTramiteComponent", () => {
  let component: DetalleTramiteComponent;
  let fixture: ComponentFixture<DetalleTramiteComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;

  const mockTramiteIn: any = {
    apellidos: "ALFREDO",
    estudiante: "SKY",
    cod_est: "1615226666",
    nombre: "EGRESADO",
    estado: "HABILITADO",
    id_est_doc: "1316152254367164252",
    fecha_doc: new Date("25/02/2022"),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleTramiteComponent],
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
        FormBuilder,
        NgbActiveModal,
        NgbModal,
        ReactiveFormsModule,
        { provide: ToastrService, useClass: ToastrService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTramiteComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    component.in_tramite = mockTramiteIn;
    fixture.detectChanges();
    component.in_tramite = mockTramiteIn;
  });

  it("DetalleTramiteComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos la funcion ngOnInit()", () => {
    const spycrearFormularios = spyOn(
      component,
      "crearFormularios"
    ).and.callThrough();
    const spyDetalleTramite = spyOn(
      component,
      "detalleTramite"
    ).and.callThrough();
    component.ngOnInit();
    expect(spycrearFormularios).toHaveBeenCalled();
    expect(spyDetalleTramite).toHaveBeenCalled();
  });

  it("Verificamos ngOnChanges()", () => {
    const spycrearFormularios = spyOn(
      component,
      "crearFormularios"
    ).and.callThrough();
    const spyDetalleTramite = spyOn(
      component,
      "detalleTramite"
    ).and.callThrough();
    component.ngOnChanges();
    expect(spycrearFormularios).toHaveBeenCalled();
    expect(spyDetalleTramite).toHaveBeenCalled();
  });
/*
  it("Verificamos seleccionarDetalle(detalleSeleccionado)", () => {
    const spyModal = spyOn(component.modalMod, "show").and.callThrough();
    component.seleccionarDetalle(mockTramiteIn);
    expect(spyModal).toHaveBeenCalled();
    expect(component.estadosActualizarForm.getRawValue().id_est_doc).toEqual(
      mockTramiteIn.id_est_doc
    );
    expect(component.estadosActualizarForm.getRawValue().estado).toEqual(
      mockTramiteIn.estado
    );
    expect(component.estadosActualizarForm.getRawValue().fecha).toEqual(
      mockTramiteIn.fecha
    );
    expect(component.estadosActualizarForm.getRawValue().observaciones).toEqual(
      mockTramiteIn.observaciones
    );
  });*/

  it("Verificamos eliminarDetalle(values)", () => {
    const spyAlertEliminar = spyOn(
      component,
      "alertEliminar"
    ).and.callThrough();
    const mockDetalleEliminar: any = {
      id_est_doc: "123534534534",
      fecha: new Date("20/02/2023"),
      estado: "FINALIZADO",
      observaciones: "NINGUNA OBSERVACION",
    };
    component.eliminarDetalle(mockDetalleEliminar);
    expect(spyAlertEliminar).toHaveBeenCalled();
    expect(component.optionDelete).toEqual(1);
    expect(component.detalleEliminar).toEqual(mockDetalleEliminar);
  });

  it("Verificamos eliminarCertificado(values)", () => {
    const spyAlertEliminar = spyOn(
      component,
      "alertEliminar"
    ).and.callThrough();
    const mockCertificadoEliminar: any = {
      url: "URL HTTP",
      fecha: new Date("20/02/2023"),
      id_est_doc: "123534534534",
    };
    component.eliminarCertificado(mockCertificadoEliminar);
    expect(spyAlertEliminar).toHaveBeenCalled();
    expect(component.optionDelete).toEqual(2);
    expect(component.certificadoEliminar).toEqual(mockCertificadoEliminar);
  });

  it("Verificamos detalleTramtie()", () => {
    const spyLlenarLista = spyOn(component, "llenarListas").and.callThrough();
    component.detalleTramite();
    expect(component.detalleForm.getRawValue().detalleTramite).toEqual(
      mockTramiteIn.id_est_doc
    );
    expect(component.detalleForm.getRawValue().detalleCodEstudiante).toEqual(
      mockTramiteIn.cod_est
    );
    expect(component.detalleForm.getRawValue().detalleApellidos).toEqual(
      mockTramiteIn.apellidos
    );
    expect(component.detalleForm.getRawValue().detalleNombres).toEqual(
      mockTramiteIn.estudiante
    );
    expect(component.detalleForm.getRawValue().detalleEstado).toEqual(
      mockTramiteIn.estado
    );
    expect(component.detalleForm.getRawValue().detalleFecha).toEqual(
      mockTramiteIn.fecha_doc
    );
    expect(spyLlenarLista).toHaveBeenCalled();
  });

  it("Verificamos llenarListas", () => {
    const spyleerDetalle = spyOn(component, "leerDetalles").and.callThrough();
    const spyleerAdjuntos = spyOn(component, "leerAdjuntos").and.callThrough();
    const spyleerCertificados = spyOn(
      component,
      "leerCertificados"
    ).and.callThrough();
    component.llenarListas();
    expect(spyleerDetalle).toHaveBeenCalled();
    expect(spyleerAdjuntos).toHaveBeenCalled();
    expect(spyleerCertificados).toHaveBeenCalled();
  });

  it("Verificamos leerDetalles()", () => {
    const mockOKResponse: any = [
      {
        id_est_doc: "23423432432",
        fecha: new Date("22/02/2023"),
        estado: "REGISTRADO",
        observaciones: "NINGUNA OBS",
      },
      {
        id_est_doc: "54324535543",
        fecha: new Date("25/02/2023"),
        estado: "PROCESANDO",
        observaciones: "NINGUNA ZOBS",
      },
    ];
    const spybuscarDetallesD = spyOn(
      servicio,
      "buscarDetallesD"
    ).and.returnValue(of(mockOKResponse));
    component.leerDetalles();
    expect(spybuscarDetallesD).toHaveBeenCalled();
    expect(component.listaDetalles).toEqual(mockOKResponse);

    // Verificamos para el caso el servicio  retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spybuscarDetallesDError = spyOn(
      servicio,
      "buscarDetallesD"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.leerDetalles();
    expect(spyToastError).toHaveBeenCalled();
    expect(spybuscarDetallesDError).toHaveBeenCalled();
  });

  it("Verificamos leerAdjuntos()", () => {
    const mockOKResponse: any = [
      {
        URL: "HTTP URL",
        FECHA: new Date("25/02/2023"),
        ID_EST_DOC: "54324535543",
      },
      {
        URL: "HTTP URL2",
        FECHA: new Date("23/02/2023"),
        ID_EST_DOC: "666535543",
      },
    ];
    const spybuscarAdjuntos = spyOn(servicio, "buscarAdjuntos").and.returnValue(
      of(mockOKResponse)
    );
    component.leerAdjuntos();
    expect(spybuscarAdjuntos).toHaveBeenCalled();
    expect(component.listaAdjuntos).toEqual(mockOKResponse);

    // Verificamos para el caso el servicio  retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spybuscarAdjuntosError = spyOn(
      servicio,
      "buscarAdjuntos"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.leerAdjuntos();
    expect(spyToastError).toHaveBeenCalled();
    expect(spybuscarAdjuntosError).toHaveBeenCalled();
  });

  it("Verificamos leerCertificados()", () => {
    const mockOKResponse: any = [
      {
        url: "URL HTTP",
        fecha: new Date("20/02/2023"),
        id_est_doc: "555534534534",
      },
      {
        url: "URL HTTP",
        fecha: new Date("20/02/2023"),
        id_est_doc: "333534534534",
      },
    ];
    const spyleerCertificados = spyOn(
      servicio,
      "buscarCertificado"
    ).and.returnValue(of(mockOKResponse));
    component.leerCertificados();
    expect(spyleerCertificados).toHaveBeenCalled();
    expect(component.listaCertificado).toEqual(mockOKResponse);

    // Verificamos para el caso el servicio  retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyleerCertificadosError = spyOn(
      servicio,
      "buscarCertificado"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.leerCertificados();
    expect(spyToastError).toHaveBeenCalled();
    expect(spyleerCertificadosError).toHaveBeenCalled();
  });



  
});
