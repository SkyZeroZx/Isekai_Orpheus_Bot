import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ServiceWorkerModule, SwPush } from "@angular/service-worker";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { Constant } from "src/app/Constants/Constant";
import { ServiciosService } from "src/app/services/servicios.service";
import { environment } from "src/environments/environment";
import { TrackingComponent } from "./tracking.component";

fdescribe("TrackingComponent", () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;
  let swPush: SwPush;
  let routeActive: ActivatedRoute;
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

  beforeEach(waitForAsync ( () => {
     TestBed.configureTestingModule({
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
        ServiceWorkerModule.register("ngsw-worker.js", {
          enabled: environment.production,
        }),
      ],
      providers: [
        ServiciosService,
        SwPush,
        NgbActiveModal,
        NgbModal,
        FormBuilder,
        { provide: ToastrService, useClass: ToastrService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    routeActive = TestBed.inject(ActivatedRoute);
    swPush = TestBed.inject(SwPush);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Habilitamos en jasmine el re espiar las funciones , caso contrario tendriamos un error
    jasmine.getEnv().allowRespy(true);
  });

  it("TrackingComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Validamos ngOnInit()", () => {
    const spyCrearFormularioTracking = spyOn(
      component,
      "crearFormularioTracking"
    ).and.callThrough();
    const spysuscribirClickPush = spyOn(
      component,
      "suscribirClickPush"
    ).and.callThrough();
    component.ngOnInit();
    expect(spyCrearFormularioTracking).toHaveBeenCalled();
    expect(spysuscribirClickPush).toHaveBeenCalled();
  });

  it("Validamos limpiarTabla()", () => {
    component.limpiarTabla();
    expect(component.adjuntoOk).toBeFalsy();
    expect(component.certificadoOk).toBeFalsy();
    expect(component.detalleOk).toBeFalsy();
  });

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
    const spyToastError = spyOn(toastrService, "error");
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
    const spyToastError = spyOn(toastrService, "error");
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
    const spyToastError = spyOn(toastrService, "error");
    const spyMockCerErr = spyOn(servicio, "buscarCertificado").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    component.leerCertificados();
    expect(spyMockCerErr).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();
  });

  it("Verificamos saveTracking", () => {
    component.ngOnInit();
    component.detalleOk = true;
    component.trackingForm.controls.idDocTramite.setValue("1234567912345632");
    component.trackingForm.controls.dni.setValue("12345678");
    const spyaddEntry = spyOn(component, "addEntry").and.callThrough();
    const spysuscribeToNotifications = spyOn(
      component,
      "suscribeToNotifications"
    );
    // Validamos la primera condiciones de saveTracking
    component.saveTracking();
    expect(spyaddEntry).toHaveBeenCalled();
    expect(spysuscribeToNotifications).toHaveBeenCalled();
    // Validamos la condicion contraria
    component.trackingForm.reset();
    const spyToastErr = spyOn(toastrService, "error");
    component.saveTracking();
    expect(spyToastErr).toHaveBeenCalled();
    // Validamos que nuestros otros espias solo fueran llamados una vez referente a la anterior prueba
    expect(spysuscribeToNotifications).toHaveBeenCalledTimes(1);
    expect(spyaddEntry).toHaveBeenCalledTimes(1);
    // Validamos el caso que no existan detalles
    component.detalleOk = false;
    component.saveTracking();
    expect(spyToastErr).toHaveBeenCalledTimes(2);
  });

  const mockHistory: any = [
    {
      id_est_doc: "1234567912345632",
      dni: "12345678",
    },
  ];

  it("Verificamos listHistory()", () => {
    const spyModalHistory = spyOn(
      component.modalHistory,
      "show"
    ).and.callThrough();
    localStorage.setItem("tracking", JSON.stringify(mockHistory));
    component.listHistory();
    expect(component.listaTramitesGuardados).toEqual(mockHistory);
    expect(spyModalHistory).toHaveBeenCalled();
    localStorage.clear();
  });

  it("Verificamos searchHistory()", () => {
    component.ngOnInit();
    component.trackingForm.controls.idDocTramite.setValue("1234567912345632");
    component.trackingForm.controls.dni.setValue("12345678");
    const spybuscarTramiteTracking = spyOn(
      component,
      "buscarTramiteTracking"
    ).and.callThrough();
    component.searchHistory(component.trackingForm.value);
    expect(spybuscarTramiteTracking).toHaveBeenCalled();
  });

  it("Verificamos saveNotification()", () => {
    localStorage.setItem("tracking", JSON.stringify(mockHistory));
    component.trackingForm.controls.idDocTramite.setValue("1234567912345632");
    component.trackingForm.controls.dni.setValue("12345678");
    const tokens = "Soy un token";
    // Validamos el caso exitoso
    const mockResponse: any = {
      message: Constant.MENSAJE_OK,
    };
    const spyToastSucess = spyOn(toastrService, "success");
    const spysaveUserNotificationOK = spyOn(
      servicio,
      "saveUserNotification"
    ).and.returnValue(of(mockResponse));
    component.saveNotification(tokens);
    expect(spyToastSucess).toHaveBeenCalled();
    expect(spysaveUserNotificationOK).toHaveBeenCalled();
    // Validamos el caso que el servicio nos retorne un mensaje diferente de OK
    const spyToastError = spyOn(toastrService, "error");
    const mockResponseDif: any = {
      message: "Something",
    };
    const spysaveUserNotificationDIF = spyOn(
      servicio,
      "saveUserNotification"
    ).and.returnValue(of(mockResponseDif));
    component.saveNotification(tokens);
    expect(spyToastError).toHaveBeenCalled();
    expect(spysaveUserNotificationDIF).toHaveBeenCalled();

    // Validamos para el caso error al llamar el servicio
    const spyMockNotErr = spyOn(
      servicio,
      "saveUserNotification"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.saveNotification(tokens);
    expect(spyMockNotErr).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalledTimes(2);
  });

  it("Verificamos suscribeToNotifications()", async () => {
    const mockToken: any = {
      token: "Soy el Token",
    };
    const spysaveNotification = await spyOn(
      component,
      "saveNotification"
    ).and.callThrough();
    const spyswPush = await spyOn(swPush, "requestSubscription").and.resolveTo(
      mockToken
    );
    await component.suscribeToNotifications();
    await expect(spyswPush).toHaveBeenCalled();
    await expect(spysaveNotification).toHaveBeenCalled();
    // Validamos en caso nuestra promesa nos retorne un error
    const spyToastError = await spyOn(toastrService, "error");
    const spyswPushErr = await spyOn(
      swPush,
      "requestSubscription"
    ).and.rejectWith("Esto es un error de la promesa");
    await component.suscribeToNotifications();
    await expect(spyswPushErr).toHaveBeenCalled();
    await expect(spyToastError).toHaveBeenCalled();
  });
});
