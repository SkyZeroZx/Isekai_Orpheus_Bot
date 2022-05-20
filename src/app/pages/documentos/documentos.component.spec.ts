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
import Swal from "sweetalert2";
import { DocumentosComponent } from "./documentos.component";

fdescribe("DocumentosComponent", () => {
  let component: DocumentosComponent;
  let fixture: ComponentFixture<DocumentosComponent>;
  let servicio: ServiciosService;
  let reporteService: ReporteService;
  let toastrService: ToastrService;
  const MockReport: any = [
    {
      cod_doc: 13,
      nombre: "EGRESADO",
      requisitos: "REQ EGRESADO",
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentosComponent],
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
    fixture = TestBed.createComponent(DocumentosComponent);
    reporteService = TestBed.inject(ReporteService);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("DocumentosComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit()", () => {
    const spycrearFormularioConsulta = spyOn(
      component,
      "crearFormularioConsulta"
    ).and.callThrough();
    const spylistarDocumentos = spyOn(
      component,
      "listarDocumentos"
    ).and.callThrough();
    component.ngOnInit();
    expect(spylistarDocumentos).toHaveBeenCalled();
    expect(spycrearFormularioConsulta).toHaveBeenCalled();
  });

  it("Verificamos ngOnChanges()", () => {
    component.ngOnChanges();
    expect(component.p).toEqual(1);
  });

  it("Verificamos exportarExcel()", () => {
    Constant.REPORT = MockReport;
    const spyServiceExcel = spyOn(
      reporteService,
      "exportAsExcelFile"
    ).and.callThrough();
    component.exportarExcel();
    expect(spyServiceExcel).toHaveBeenCalled();
  });

  it("Verificamos exportarPDF()", () => {
    Constant.REPORT = MockReport;
    const spyServicePDF = spyOn(
      reporteService,
      "exportAsPDF"
    ).and.callThrough();
    component.exportarPDF();
    expect(spyServicePDF).toHaveBeenCalled();
  });

  it("Verificamos crearDocumento()", () => {
    const spyModalNew = spyOn(
      component.modalNewDocument,
      "show"
    ).and.callThrough();
    component.crearDocumento();
    expect(spyModalNew).toHaveBeenCalled();
    expect(component.crearDocumentoOk).toBeTruthy();
  });

  it("Verificamos editarDocumento()", () => {
    const mockDocument: any = {
      cod_doc: "13",
      nombre: "EGRESADO",
      requisitos: "REQUISITOS",
    };
    const spyModalNew = spyOn(
      component.modalEditDocument,
      "show"
    ).and.callThrough();
    component.editarDocumento(mockDocument);
    expect(spyModalNew).toHaveBeenCalled();
    expect(component.editarDocumentOK).toBeTruthy();
    expect(component.documentoSeleccionado).toEqual(mockDocument);
  });

  it("Verificamos listarDocumentos", () => {
    // Mockeamos el retorno de nuestro servicio getAllDocuments
    const MockResponseGetAllDocuments: any = [
      {
        cod_doc: 13,
        nombre: "EGRESADO",
        requisitos: "REQ EGRESADO",
      },
      {
        cod_doc: 14,
        nombre: "TITULACION",
        requisitos: "REQ TITULACION",
      },
    ];
    const spyReturnMock = spyOn(servicio, "getAllDocuments").and.returnValue(
      of(MockResponseGetAllDocuments)
    );
    component.listarDocumentos();
    expect(component.listaDocumentosOk).toBeTruthy();
    expect(spyReturnMock).toHaveBeenCalled();
    expect(component.listaDocumentos).toEqual(MockResponseGetAllDocuments);

    // Validamos para el caso que el servicio nos retorne un error
    const spyReturnMockErr = spyOn(servicio, "getAllDocuments").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    component.listarDocumentos();
    expect(spyToastError).toHaveBeenCalled();
    expect(spyReturnMockErr).toHaveBeenCalled();
  });

  it("Verificamos alertDeleteDoc(documento)", async () => {
    const mockDocument: any = {
      cod_doc: "13",
      nombre: "EGRESADO",
      requisitos: "REQUISITOS",
    };
    const spyEliminarDoc = await spyOn(
      component,
      "eliminarDocumento"
    ).and.callThrough();
    await component.alertDeleteDoc(mockDocument);
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // validamos el titulo
    await expect(Swal.getTitle().textContent).toEqual("Eliminar Documento");
    // Realizamos click en confirm
    await Swal.clickConfirm();
    //Validamos que se llame la funcion eliminarDocumento
    await expect(spyEliminarDoc).toHaveBeenCalledTimes(1);

    // Validamos el caso contrario que no aceptamos el mensaje de confirmacion de eliminar usuario
    await component.alertDeleteDoc(mockDocument);
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // Realizamos click en denied
    await Swal.clickDeny();
    //Validamos que se solo se hubiera llamado una vez nuestra funcion
    await expect(spyEliminarDoc).toHaveBeenCalledTimes(1);
  });

  it("Validamos eliminarDocumento(cod_doc)", () => {
    // Validamos la condicion cuando el servicio retorna MENSAJE_OK
    const mockResponse: any = {
      message: Constant.MENSAJE_OK,
    };
    const spylistarDocumentos = spyOn(
      component,
      "listarDocumentos"
    ).and.callThrough();
    const spydeleteDocument = spyOn(servicio, "deleteDocument").and.returnValue(
      of(mockResponse)
    );
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    component.eliminarDocumento("13");
    expect(spydeleteDocument).toHaveBeenCalled();
    expect(spylistarDocumentos).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    expect(component.p).toEqual(1);
    // Validamos cuando el servicio nos retorna un valor diferente de MENSAJE_OK
    const mockDiferent: any = {
      message: "DIFERENTE",
    };
    const spyToastErr = spyOn(toastrService, "success").and.callThrough();
    const spydeleteDocumentDif = spyOn(
      servicio,
      "deleteDocument"
    ).and.returnValue(of(mockDiferent));
    component.eliminarDocumento("13");
    expect(spydeleteDocumentDif).toHaveBeenCalled();
    expect(spyToastErr).toHaveBeenCalled();
    // Validamos para el caso que el servicio retorne un error
    // Validamos para el caso que el servicio nos retorne un error
    const spyDeleteMockErr = spyOn(servicio, "deleteDocument").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    component.eliminarDocumento("13");
    expect(spyToastError).toHaveBeenCalledTimes(1);
    expect(spyDeleteMockErr).toHaveBeenCalled();
  });
});
