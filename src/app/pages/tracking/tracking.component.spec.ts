import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { ServiciosService } from "src/app/services/servicios.service";
import { TrackingComponent } from "./tracking.component";

fdescribe("TrackingComponent", () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingComponent],
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("TrackingComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Validamos ngOnInit()", () => {
    const spyCrearFormularioTracking = spyOn(
      component,
      "crearFormularioTracking"
    ).and.callThrough();
    component.ngOnInit();
    expect(spyCrearFormularioTracking).toHaveBeenCalled();
  });

  it("Validamos limpiarTabla()", () => {
    component.limpiarTabla();
    expect(component.adjuntoOk).toBeFalsy();
    expect(component.certificadoOk).toBeFalsy();
    expect(component.detalleOk).toBeFalsy();
  });
  const mockTracking: any = [
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-18 15:40:15.713475",
      estado: "PROCESANDO",
      observaciones: "gfhfghhhhh",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-17 02:21:05.544765",
      estado: "FINALIZADO",
      observaciones: "finalizado",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-17 02:19:42.206293",
      estado: "PROCESANDO",
      observaciones: "fdsfsdfsdf",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-15 04:39:16.646715",
      estado: "FINALIZADO",
      observaciones: "1234567890",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-15 04:39:03.385125",
      estado: "PROCESANDO",
      observaciones: "sdfdsfsdf",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-14 22:57:34.536344",
      estado: "OBSERVADO",
      observaciones: "cvfgfdgfdg",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-14 02:04:31.547590",
      estado: "PROCESANDO",
      observaciones: "SDSDSDSDDDDDD",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-14 00:54:05.151860",
      estado: "FINALIZADO",
      observaciones: "FINALIZADOADS",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-14 00:53:44.292201",
      estado: "PROCESANDO",
      observaciones: "PROCESANDO TRAMITE",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-14 00:52:39.255025",
      estado: "OBSERVADO",
      observaciones: "dfsdfsdfsdfsd",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha: "2022-05-12 00:29:48.940383",
      estado: "REGISTRADO",
      observaciones: "Registrado exitosamente por chatbot",
    },
  ];
  it("Validamos buscarTramiteTracking()", () => {
    const spyLimpiarTabla = spyOn(component, "limpiarTabla").and.callThrough();
    const spyMockTracking = spyOn(
      servicio,
      "buscarTramiteDetalleDniAndId"
    ).and.returnValue(of(mockTracking));
    const spyLeerAdjuntos = spyOn(component, "leerAdjuntos").and.callThrough();
    const spyLeerCertificados = spyOn(
      component,
      "leerCertificados"
    ).and.callThrough();
    component.buscarTramiteTracking();
    expect(spyLimpiarTabla).toHaveBeenCalled();
    expect(spyMockTracking).toHaveBeenCalled();
    expect(spyLeerAdjuntos).toHaveBeenCalled();
    expect(spyLeerCertificados).toHaveBeenCalled();
    expect(component.detalleOk).toBeTruthy();
    expect(component.listaDetalles).toEqual(mockTracking);
    // Validamos para el caso que no tenga un reponse con data
    const mockVacio: any = [];
    const spyMockTrackingVoid = spyOn(
      servicio,
      "buscarTramiteDetalleDniAndId"
    ).and.returnValue(of(mockVacio));
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    component.buscarTramiteTracking();
    expect(spyMockTrackingVoid).toHaveBeenCalled();
    expect(spyLimpiarTabla).toHaveBeenCalledTimes(3);
    expect(spyToastError).toHaveBeenCalled();
    // Validamos para el caso error al llamar el servicio
    const spyMockTrackingErr = spyOn(
      servicio,
      "buscarTramiteDetalleDniAndId"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.buscarTramiteTracking();
    expect(spyMockTrackingErr).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalledTimes(2);
  });

  it("Verificamos leerAdjuntos()", () => {
    const mockAdjuntos: any = [
      {
        URL: "https://www.kikesport.com.pe/bot/adj_tramite/adjunto_793691201121_13142522506172514695.pdf",
        FECHA: "2022-05-19 04:17:39.743492",
        ID_EST_DOC: "13142522506172514695",
      },
      {
        URL: "https://www.kikesport.com.pe/bot/adj_tramite/adjunto_226393878688_13142522506172514695.pdf",
        FECHA: "2022-05-19 04:17:40.098602",
        ID_EST_DOC: "13142522506172514695",
      },
    ];
    const spyMockAdjuntos = spyOn(servicio, "buscarAdjuntos").and.returnValue(
      of(mockAdjuntos)
    );
    component.leerAdjuntos();
    expect(component.listaAdjuntos).toEqual(mockAdjuntos);
    expect(spyMockAdjuntos).toHaveBeenCalled();
    expect(component.adjuntoOk).toBeTruthy();
    // Validamos para el caso error al llamar el servicio
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyMockAdjuntosErr = spyOn(
      servicio,
      "buscarAdjuntos"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.leerAdjuntos();
    expect(spyMockAdjuntosErr).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();
  });

  it("Verificamos leerCertificados()", () => {
    const mockCertificados: any = [
      {
        url: "https://www.kikesport.com.pe/bot/certificados/TRAMITE_13161522543671642522.pdf",
        fecha: "2022-05-14 02:02:00.859258",
        id_est_doc: "13161522543671642522",
      },
    ];
    const spyMockCer = spyOn(servicio, "buscarCertificado").and.returnValue(
      of(mockCertificados)
    );
    component.leerCertificados();
    expect(component.listaCertificado).toEqual(mockCertificados);
    expect(component.certificadoOk).toBeTruthy();
    expect(spyMockCer).toHaveBeenCalled();

    // Validamos para el caso error al llamar el servicio
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyMockCerErr = spyOn(servicio, "buscarCertificado").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    component.leerCertificados();
    expect(spyMockCerErr).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();
  });
});
