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
import { Constant } from "src/app/Constants/Constant";
import { ServiciosService } from "src/app/services/servicios.service";
import Swal from "sweetalert2";
import { CreateTramiteComponent } from "../create-tramite/create-tramite.component";
import { EditTramiteComponent } from "../edit-tramite/edit-tramite.component";
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
      declarations: [
        DetalleTramiteComponent,
        CreateTramiteComponent,
        EditTramiteComponent,
      ],
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
    let simpleChanges;
    component.ngOnChanges(simpleChanges);
    expect(spycrearFormularios).toHaveBeenCalled();
    expect(spyDetalleTramite).toHaveBeenCalled();
  });
  
  it("Verificamos seleccionarDetalle(detalleSeleccionado)", () => {
    const spyModal = spyOn(component.modalMod, "show").and.callThrough();
    component.seleccionarDetalle(mockTramiteIn);
    expect(component.updateDetalle).toEqual(mockTramiteIn);
    expect(spyModal).toHaveBeenCalled();
    expect(component.seleccionEditOk).toBeTruthy();
  });

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

  it("Verificamos updateCreateTramite()", () => {
    const spyLeerDetalle = spyOn(component, "leerDetalles").and.callThrough();
    const syleerCertificados = spyOn(
      component,
      "leerCertificados"
    ).and.callThrough();
    component.crearFormularios();
    const mockEstado: any = "FINALIZADO";
    component.updateCreateTramite(mockEstado);
    expect(spyLeerDetalle).toHaveBeenCalled();
    expect(syleerCertificados).toHaveBeenCalled();

    expect(component.detalleForm.getRawValue().detalleEstado).toEqual(
      mockEstado
    );
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

  it("Verificamos callServicedeleteDetalleTramite()", () => {
    // Verificamos cuando el servicio devuelve una respuesta OK
    const mockResponseOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spyDeleteTramiteOK = spyOn(servicio, "deleteTramite").and.returnValue(
      of(mockResponseOK)
    );
    const spyleerDetalles = spyOn(component, "leerDetalles").and.callThrough();
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    component.ngOnInit();
    component.callServicedeleteDetalleTramite();
    expect(spyDeleteTramiteOK).toHaveBeenCalled();
    expect(spyleerDetalles).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    // Validamos para el caso contrario
    const mockResponseDF: any = {
      message: "Something",
    };
    const spyDeleteTramiteDF = spyOn(servicio, "deleteTramite").and.returnValue(
      of(mockResponseDF)
    );
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    component.ngOnInit();
    component.callServicedeleteDetalleTramite();
    expect(spyDeleteTramiteDF).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();
    // Verificamos para el caso el servicio  retorna un error
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();
    const spyDeleteTramiteError = spyOn(
      servicio,
      "deleteTramite"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.callServicedeleteDetalleTramite();
    expect(spyToastErr).toHaveBeenCalled();
    expect(spyDeleteTramiteError).toHaveBeenCalled();
  });

  it("Verificamos callServiceDeleteCertificado()", () => {
    // Verificamos cuando el servicio devuelve una respuesta OK
    const mockResponseOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spyDeleteCertificadoOK = spyOn(
      servicio,
      "deleteCertificado"
    ).and.returnValue(of(mockResponseOK));
    const spyleerCertificados = spyOn(
      component,
      "leerCertificados"
    ).and.callThrough();
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    component.ngOnInit();
    component.callServiceDeleteCertificado();
    expect(spyDeleteCertificadoOK).toHaveBeenCalled();
    expect(spyleerCertificados).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    // Validamos para el caso contrario
    const mockResponseDF: any = {
      message: "Something",
    };
    const spyDeleteCertificadoDF = spyOn(
      servicio,
      "deleteCertificado"
    ).and.returnValue(of(mockResponseDF));
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    component.ngOnInit();
    component.callServiceDeleteCertificado();
    expect(spyDeleteCertificadoDF).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();
    // Verificamos para el caso el servicio  retorna un error
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();
    const spyDeleteCertificadoError = spyOn(
      servicio,
      "deleteCertificado"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.ngOnInit();
    component.callServiceDeleteCertificado();
    expect(spyToastErr).toHaveBeenCalled();
    expect(spyDeleteCertificadoError).toHaveBeenCalled();
  });

  it("Verificamos alertEliminar()", async () => {
    // Validamos para el case 1
    component.optionDelete = 1;
    const spyCallServicedeleteDetalleTramite = spyOn(
      component,
      "callServicedeleteDetalleTramite"
    ).and.callThrough();

    // Llamamos nuestro component de sweetalert2 de primerlogin
    await component.alertEliminar();
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // validamos el titulo
    await expect(Swal.getTitle().textContent).toEqual(
      "¿Estas seguro de eliminar este registro?"
    );
    // Realizamos click en confirm
    await Swal.clickConfirm();
    expect(spyCallServicedeleteDetalleTramite).toHaveBeenCalled();
    // Validamos el caso contrario
    await component.alertEliminar();
    await Swal.clickDeny();
    await expect(spyCallServicedeleteDetalleTramite).toHaveBeenCalledTimes(1);

    // Validamos para el case 2
    component.optionDelete = 2;
    const spyCallServiceDeleteCertificado = spyOn(
      component,
      "callServiceDeleteCertificado"
    ).and.callThrough();
    // Llamamos nuestro component de sweetalert2 de primerlogin
    await component.alertEliminar();
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // validamos el titulo
    await expect(Swal.getTitle().textContent).toEqual(
      "¿Estas seguro de eliminar este registro?"
    );
    // Realizamos click en confirm
    await Swal.clickConfirm();
    expect(spyCallServiceDeleteCertificado).toHaveBeenCalled();
    // Validamos el caso contrario
    await component.alertEliminar();
    await Swal.clickDeny();
    await expect(spyCallServiceDeleteCertificado).toHaveBeenCalledTimes(1);

    // Validamos para un case diferente de 1 y 2 de , por ejemplo 3
    component.optionDelete = 3;
    const spyToastError = await spyOn(toastrService, "error").and.callThrough();
    // Llamamos nuestro component de sweetalert2 de primerlogin
    await component.alertEliminar();
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // validamos el titulo
    await expect(Swal.getTitle().textContent).toEqual(
      "¿Estas seguro de eliminar este registro?"
    );
    // Realizamos click en confirm
    await Swal.clickConfirm();
    expect(spyCallServiceDeleteCertificado).toHaveBeenCalled();
    await expect(spyToastError).toHaveBeenCalled();
    // Validamos el caso contrario
    await component.alertEliminar();
    await Swal.clickDeny();
    await expect(spyCallServiceDeleteCertificado).toHaveBeenCalledTimes(1);
    await expect(spyCallServicedeleteDetalleTramite).toHaveBeenCalledTimes(1);
  });
});
