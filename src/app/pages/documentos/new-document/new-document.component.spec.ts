import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { Constant } from "src/app/Constants/Constant";
import { ReporteService } from "src/app/services/report.service";
import { ServiciosService } from "src/app/services/servicios.service";

import { NewDocumentComponent } from "./new-document.component";

fdescribe("NewDocumentComponent", () => {
  let component: NewDocumentComponent;
  let fixture: ComponentFixture<NewDocumentComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewDocumentComponent],
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
    fixture = TestBed.createComponent(NewDocumentComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("NewDocumentComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit()", () => {
    const spycrearFormularioCreateUser = spyOn(
      component,
      "crearFormularioCreateUser"
    ).and.callThrough();
    component.ngOnInit();
    expect(spycrearFormularioCreateUser).toHaveBeenCalled();
  });

  it("Verificamos crearDocumento()", () => {
    // Espiamos nuestro servicio y forzamos que retorne un MENSAJE_OK
    const mockResOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spycreateDocumentOK = spyOn(
      servicio,
      "createDocument"
    ).and.returnValue(of(mockResOK));
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    component.crearFormularioCreateUser();
    component.crearDocumento();

    expect(spycreateDocumentOK).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    expect(component.crearDocForm.getRawValue().nombre).toBeNull()
    expect(component.crearDocForm.getRawValue().requisitos).toBeNull()
    // Validamos para el caso que el servicio nos retorne un mensaje diferente de MENSAJE_OK
    const mockResDif: any = {
      message: "DIFERENTE",
    };
    const spycreateDocumentDif = spyOn(
      servicio,
      "createDocument"
    ).and.returnValue(of(mockResDif));
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();
    component.crearDocumento();
    expect(spycreateDocumentDif).toHaveBeenCalled();
    expect(spyToastErr).toHaveBeenCalled();

    // Validamos para el caso que el servicio nos retorne un error
    const spyCreateDocMockErr = spyOn(
      servicio,
      "createDocument"
    ).and.returnValue(throwError(() => new Error("Error en el servicio")));
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    component.crearDocumento();
    expect(spyCreateDocMockErr).toHaveBeenCalled();
    expect(spyToastError).toHaveBeenCalled();
  });
});
