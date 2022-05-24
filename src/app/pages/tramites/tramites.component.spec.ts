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
import { Constant } from "src/app/Constants/Constant";
import { ReporteService } from "src/app/services/report.service";
import { ServiciosService } from "src/app/services/servicios.service";
import { CreateTramiteComponent } from "./components/create-tramite/create-tramite.component";
import { EditTramiteComponent } from "./components/edit-tramite/edit-tramite.component";
import { TramitesComponent } from "./tramites.component";

fdescribe("TramiteComponent", () => {
  let component: TramitesComponent;
  let fixture: ComponentFixture<TramitesComponent>;
  let servicio: ServiciosService;
  let reporteService: ReporteService;
  let toastrService: ToastrService;
  const mockReport = [
    {
      id_est_doc: "13142522506172514695",
      fecha_doc: "2022-05-19 04:20:47.444723",
      estado: "REGISTRADO",
      nombre: "EGRESADO",
      cod_est: "1425225061",
      estudiante: "KEVIN",
      apellidos: "PACHECO GUTIERREZ",
    },
    {
      id_est_doc: "13161521506970666555",
      fecha_doc: "2022-05-19 04:33:58.042923",
      estado: "REGISTRADO",
      nombre: "EGRESADO",
      cod_est: "1615215069",
      estudiante: "OMAR",
      apellidos: "RAMOS MORE",
    },
    {
      id_est_doc: "13161522543671642522",
      fecha_doc: "2022-05-18 15:40:15.713475",
      estado: "PROCESANDO",
      nombre: "EGRESADO",
      cod_est: "1615225436",
      estudiante: "JAIME",
      apellidos: "BURGOS TEJADA",
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TramitesComponent,CreateTramiteComponent,EditTramiteComponent],
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
    fixture = TestBed.createComponent(TramitesComponent);
    reporteService = TestBed.inject(ReporteService);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("TramiteComponent creado correctamente", () => {
    expect(component).toBeTruthy();
    expect(component.p).toEqual(1);
    expect(component.listaTramiteOk).toBeFalsy();
    expect(component.modalVisible).toBeFalsy();
  });

  it("Verificamos ngOnInit", () => {
    const spyCrearFormularioConsulta = spyOn(
      component,
      "crearFormularioConsulta"
    ).and.callThrough();
    const spylistarTramiteDoc =spyOn(component,'listarTramiteDoc').and.callThrough();
    component.ngOnInit();
    expect(spyCrearFormularioConsulta).toHaveBeenCalled();
    expect(spylistarTramiteDoc).toHaveBeenCalled();
    
  });

  it("Verificamos detalleTramite", () => {
    const mock: any = {
      apellidos: "MOR",
      estudiante: "ALFREDO",
      cod_est: "1615225436",
      nombre: "ALFREDO",
      estado: "REGISTRADO",
      id_est_doc: "string",
      fecha_doc: new Date("19/05/2022"),
    };
    const spyModal = spyOn(component.modal, "show").and.callThrough();
    component.detalleTramite(mock);
    expect(component.tramiteSeleccionado).toEqual(mock);
    expect(component.modalVisible).toBeTruthy();
    expect(spyModal).toHaveBeenCalled();
  });

  it("Verificamos onChangeForm", () => {
    component.onChangeForm();
    expect(component.p).toEqual(1);
  });

  it("Verificamos exportarExcel()", () => {
    const spyReporte = spyOn(
      reporteService,
      "exportAsExcelFile"
    ).and.callThrough();
    Constant.REPORT = mockReport;
    component.exportarExcel();
    expect(spyReporte).toHaveBeenCalled();
  });

  it("Verificamos ExportarPDF", () => {
    Constant.REPORT = mockReport;
    const spyReportePDF = spyOn(
      reporteService,
      "exportAsPDF"
    ).and.callThrough();
    component.exportarPDF();
    expect(spyReportePDF).toHaveBeenCalled();
  });

  it("Verificamos listarTramiteDoc", () => {
    const mockResponse: any = [
      {
        id_est_doc: "13142522506172514695",
        fecha_doc: "2022-05-19 04:20:47.444723",
        estado: "REGISTRADO",
        nombre: "EGRESADO",
        cod_est: "1425225061",
        estudiante: "KEVIN",
        apellidos: "PACHECO GUTIERREZ",
      },
      {
        id_est_doc: "13161521506970666555",
        fecha_doc: "2022-05-19 04:33:58.042923",
        estado: "REGISTRADO",
        nombre: "EGRESADO",
        cod_est: "1615215069",
        estudiante: "OMAR",
        apellidos: "RAMOS MORE",
      },
      {
        id_est_doc: "13161522543671642522",
        fecha_doc: "2022-05-18 15:40:15.713475",
        estado: "PROCESANDO",
        nombre: "EGRESADO",
        cod_est: "1615225436",
        estudiante: "JAIME",
        apellidos: "BURGOS TEJADA",
      },
    ];
    const spyListarTramites = spyOn(servicio, "listaTramites").and.returnValue(
      of(mockResponse)
    );
    component.listarTramiteDoc();
    expect(component.listaTramiteDoc).toEqual(mockResponse);
    expect(component.listaTramiteOk).toBeTruthy();
    expect(spyListarTramites).toHaveBeenCalled();

    // Verificamos para el caso el servicio  retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyListarTramitesError = spyOn(
      servicio,
      "listaTramites"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    component.listarTramiteDoc();
    expect(spyToastError).toHaveBeenCalled();
    expect(spyListarTramitesError).toHaveBeenCalled();
  });
});
