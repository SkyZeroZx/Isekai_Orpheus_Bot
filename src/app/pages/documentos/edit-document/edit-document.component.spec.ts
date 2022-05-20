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
import { Documento } from "src/app/entities/tramite";
import { ReporteService } from "src/app/services/report.service";
import { ServiciosService } from "src/app/services/servicios.service";
import { EditDocumentComponent } from "./edit-document.component";

fdescribe("EditDocumentComponent", () => {
  let component: EditDocumentComponent;
  let fixture: ComponentFixture<EditDocumentComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;
  let mockInData: any = {
    cod_doc: 13,
    nombre: "EGRESADO",
    requisitos: "REQ EGRESADO",
  };
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [EditDocumentComponent],
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
    fixture = TestBed.createComponent(EditDocumentComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    component.in_doc = mockInData;

    // Habilitamos en jasmine el re espiar las funciones , caso contrario tendriamos un error
    jasmine.getEnv().allowRespy(true);
  });

  it("EditDocumentComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit()", () => {
    const spycrearFormularioEditarDoc = spyOn(
      component,
      "crearFormularioEditarDoc"
    ).and.callThrough();
    const spydetalleDocumento = spyOn(
      component,
      "detalleDocumento"
    ).and.callThrough();
    component.ngOnInit();
    expect(spydetalleDocumento).toHaveBeenCalled();
    expect(spycrearFormularioEditarDoc).toHaveBeenCalled();
  });

  it("Verificamos ngOnChanges()", () => {
    let simpleChanges: any;
    const spycrearFormularioEditarDoc = spyOn(
      component,
      "crearFormularioEditarDoc"
    ).and.callThrough();
    const spydetalleDocumento = spyOn(
      component,
      "detalleDocumento"
    ).and.callThrough();
    component.ngOnChanges(simpleChanges);
    expect(spydetalleDocumento).toHaveBeenCalled();
    expect(spycrearFormularioEditarDoc).toHaveBeenCalled();
  });

  it("Verificamos detalleDocumento()", () => {
    component.crearFormularioEditarDoc();
    component.detalleDocumento();
    expect(component.editarDocForm.getRawValue().cod_doc).toEqual(
      mockInData.cod_doc
    );
    expect(component.editarDocForm.getRawValue().nombre).toEqual(
      mockInData.nombre
    );
    expect(component.editarDocForm.getRawValue().requisitos).toEqual(
      mockInData.requisitos
    );
  });

  it("Verificamos actualizarDocumento()", () => {
    // Preparamos la data de nuestro formulario para invocar la funcion
    component.crearFormularioEditarDoc();
    component.detalleDocumento();
    // Espiamos y retornamos un MENSAJE_OK para el servicio updateDocument
    const mockResOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spyupdateDocument = spyOn(servicio, "updateDocument").and.returnValue(
      of(mockResOK)
    );
    const spytoastrSuccess = spyOn(toastrService, "success").and.callThrough();
    component.actualizarDocumento();
    expect(spyupdateDocument).toHaveBeenCalled();
    expect(spytoastrSuccess).toHaveBeenCalled();

    // Espiamos y retornamos un diferente de MENSAJE_OK para el servicio updateDocument
    const mockResDif: any = {
      message: "Something",
    };
    const spyupdateDocumentDif = spyOn(
      servicio,
      "updateDocument"
    ).and.returnValue(of(mockResDif));
    const spytoastrErr = spyOn(toastrService, "success").and.callThrough();
    component.actualizarDocumento();
    expect(spyupdateDocumentDif).toHaveBeenCalled();
    expect(spytoastrErr).toHaveBeenCalled();

    // Validamos para el caso que el servicio nos retorne un error
    const spyUpdateDocMockErr = spyOn(
      servicio,
      "updateDocument"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    component.actualizarDocumento();
    expect(spyUpdateDocMockErr).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();
  });
});
