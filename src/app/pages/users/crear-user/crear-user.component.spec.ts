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

import { CrearUserComponent } from "./crear-user.component";

fdescribe("CrearUserComponent", () => {
  let component: CrearUserComponent;
  let fixture: ComponentFixture<CrearUserComponent>;
  let servicio: ServiciosService;
  let toastrService: ToastrService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearUserComponent],
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
    fixture = TestBed.createComponent(CrearUserComponent);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  const MOCK_USERFORM: any = {
    username: " USERNAME  ",
    nombre: "  NOMBRE  ",
    apellidoPaterno: " PATERNO   ",
    apellidoMaterno: " MATERNO   ",
  };
  it("CrearUserComponent correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit", () => {
    const spycrearFormularioCreateUser = spyOn(
      component,
      "crearFormularioCreateUser"
    ).and.callThrough();
    component.ngOnInit();
    expect(spycrearFormularioCreateUser).toHaveBeenCalled();
  });

  it("Verificamos trimCrearUserForm()", () => {
    component.crearFormularioCreateUser();
    // Preparamos los valores a evaluar
    component.crearUserForm.controls.username.setValue(MOCK_USERFORM.username);
    component.crearUserForm.controls.nombre.setValue(MOCK_USERFORM.nombre);
    component.crearUserForm.controls.apellidoPaterno.setValue(
      MOCK_USERFORM.apellidoPaterno
    );
    component.crearUserForm.controls.apellidoMaterno.setValue(
      MOCK_USERFORM.apellidoMaterno
    );
    // Llamamos nuestra funcion
    component.trimCrearUserForm();
    expect(component.crearUserForm.getRawValue().username).toEqual(
      MOCK_USERFORM.username.trim()
    );
    expect(component.crearUserForm.getRawValue().nombre).toEqual(
      MOCK_USERFORM.nombre.trim()
    );
    expect(component.crearUserForm.getRawValue().apellidoPaterno).toEqual(
      MOCK_USERFORM.apellidoPaterno.trim()
    );
    expect(component.crearUserForm.getRawValue().apellidoMaterno).toEqual(
      MOCK_USERFORM.apellidoMaterno.trim()
    );
  });

  it("Verificamos crearUsuario()", () => {
    // Inicializamos nuestro formulario
    component.ngOnInit();
    const spytrimCrearUserForm = spyOn(
      component,
      "trimCrearUserForm"
    ).and.callThrough();
    //Creamos el objeto resMockOK
    const resMockOK: any = {
      message: Constant.MENSAJE_OK,
    };
    //Espiamos nuestro toast success
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    //Espiamos el metodo reset del reactiveForm
    const spyFormReset = spyOn(
      component.crearUserForm,
      "reset"
    ).and.callThrough();
    // Espiamos y forzamos el retorno de RESPUESTA_OK al servicio createUser
    const spyMockCreateUser = spyOn(servicio, "createUser").and.returnValue(
      of(resMockOK)
    );
    //Llamamos nuestra funcion a evaluar
    component.crearUsuario();
    //Validamos que sea llamado nuestro espias
    expect(spytrimCrearUserForm).toHaveBeenCalled();
    expect(spyToastSucess).toHaveBeenCalled();
    expect(spyMockCreateUser).toHaveBeenCalled();
    expect(spyFormReset).toHaveBeenCalled();
    //Validamos que el valor asignado sea admin
    expect(component.crearUserForm.getRawValue().role).toEqual("admin");

    // Validamos para el caso que el servicio nos retorne un valor diferente de MENSAJE_OK
    const resMockDif: any = {
      message: "Something",
    };
    //Espiamos nuestro toast Error
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();
    // Espiamos y forzamos el retorno de una respuesta diferente de RESPUESTA_OK al servicio createUser
    const spyMockCreateUserDif = spyOn(servicio, "createUser").and.returnValue(
      of(resMockDif)
    );
    // Creamos previamente los formularios
    component.ngOnInit();
    // Llamamos la funcion a evaluar
    component.crearUsuario();
    expect(spyToastErr).toHaveBeenCalled();
    expect(spyMockCreateUserDif).toHaveBeenCalled();

    //Validamos para cuando el servicio retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyError = spyOn(servicio, "createUser").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    // Creamos previamente los formularios
    component.ngOnInit();
    // Llamamos la funcion a evaluar
    component.crearUsuario();
    expect(spyToastError).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });
});
