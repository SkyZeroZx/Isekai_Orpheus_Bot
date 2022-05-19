import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of, Subject, throwError } from "rxjs";
import { AuthLayoutRoutes } from "src/app/layouts/auth-layout/auth-layout.routing";
import { AuthService } from "src/app/services/auth.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { LoginComponent } from "./login.component";
import { RouterTestingModule } from "@angular/router/testing";
import Swal from "sweetalert2";
import { Constant } from "src/app/Constants/Constant";

fdescribe("LoginComponent", async () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: AuthService;
  let toast: ToastrService;
  let mockRouter = {
    navigate: jasmine.createSpy("navigate"),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule,
        RouterModule.forChild(AuthLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        ToastrService,
        AuthService,
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        NgbActiveModal,
        NgbModal,
        ReactiveFormsModule,
        { provide: ToastrService, useClass: ToastrService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    auth = TestBed.inject(AuthService);
    toast = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Habilitamos en jasmine el re espiar las funciones , caso contrario tendriamos un error
    jasmine.getEnv().allowRespy(true);
  });

  it("LoginComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit", () => {
    const spy = spyOn(component, "crearFormularioLogin").and.callThrough();
    spyOn(localStorage.__proto__, "clear").and.returnValue("true");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(localStorage.__proto__.clear).toHaveBeenCalled();
  });

  it("Verificamos showPassword", () => {
    component.showPassword();
    expect(component.show_button).toBeTruthy();
    expect(component.show_eye).toBeTruthy();

    component.showPassword();
    expect(component.show_button).toBeFalsy();
    expect(component.show_eye).toBeFalsy();
  });

  it("Verificamos alertFirstLogin", async () => {
    // Llamamos nuestro component de sweetalert2 de primerlogin
    await component.alertFirstLogin();
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // validamos el titulo
    await expect(Swal.getTitle().textContent).toEqual("Es su primer login");
    // Realizamos click en confirm
    await Swal.clickConfirm();
    await expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/change-password",
    ]);
    // Validamos el caso contrario
    await spyOn(localStorage.__proto__, "clear").and.returnValue("true");
    await component.alertFirstLogin();
    await Swal.clickDeny();
    await expect(localStorage.__proto__.clear).toHaveBeenCalled();
  });

  it("Validamos onLogin()", () => {
    // Incializamos el componente con la creacion del loginForm
    component.ngOnInit();
    // Espiamos al servicio auth y su funcion login
    const spyLogin = spyOn(auth, "login").and.callThrough();
    // Seteamos nuestros valores en nuestro reactiveForm para la pruebas
    component.loginForm.controls.username.setValue("SkyZeroZx");
    component.loginForm.controls.password.setValue("1234567890");
    // Llamamos nuestra funcion a evaluar
    component.onLogin();
    //Validamos que sea llamado nuestro espia
    expect(spyLogin).toHaveBeenCalled();

    // Para validar la condicionales de nuestra repuesta mockeamos un response del servicio login
    const mockDataResponseLoginOK = {
      username: "SkyZeroZx",
      message: Constant.MENSAJE_OK,
      token: "SoyUnToken",
      userId: 13,
      firstLogin: false,
    };
    const spyMock = spyOn(auth, "login").and.callFake(() => {
      return of(mockDataResponseLoginOK);
    });
    // Llamamos nuestra funcion a evaluar y validamos el caso OK
    component.onLogin();
    // Validamos que se llama nuestro servicio mockeado
    expect(spyMock).toHaveBeenCalled();
    // validamos la navegacion con nuestro spyRouter
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/dashboard"]);

    // Validamos para el caso que el servicio nos de una respuesta mensaje OK pero primer login
    const spyAlertFirstLogin = spyOn(component, "alertFirstLogin");
    const mockDataResponseLoginFirst = {
      username: "SkyZeroZx",
      message: Constant.MENSAJE_OK,
      token: "SoyUnToken",
      userId: 13,
      firstLogin: true,
    };
    const spyLoginFirst = spyOn(auth, "login").and.callFake(() => {
      return of(mockDataResponseLoginFirst);
    });

    // Llamamos nuestra funcion a evaluar
    component.onLogin();
    // Validamos que se llama nuestro servicio mockeado
    expect(spyLoginFirst).toHaveBeenCalled();

    // Validamos que se llama nuestro funcion alertFirstLogin
    expect(spyAlertFirstLogin).toHaveBeenCalled();

    // Verificamos en caso nos retorne un mensaje diferente de OK el servicio
    const mockDataResponseLoginDiferent = {
      username: "SkyZeroZx",
      message: "Sucedio un error backend",
      token: "SoyUnToken",
      userId: 13,
      firstLogin: false,
    };
    const spyLoginDif = spyOn(auth, "login").and.callFake(() => {
      return of(mockDataResponseLoginDiferent);
    });
    const spyToastErrorDif = spyOn(toast, "error").and.callThrough();
    // Llamamos nuestra funcion a evaluar
    component.onLogin();
    // Validamos que se llama nuestro servicio mockeado
    expect(spyLoginDif).toHaveBeenCalled();
    // Validamos que se llama nuestro toast error
    expect(spyToastErrorDif).toHaveBeenCalled();

    // Verificamos  para el caso que el servicio login nos retorne un error
    const spyToastError = spyOn(toast, "error").and.callThrough();
    const spyError = spyOn(auth, "login").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    // Llamamos nuestra funcion a evaluar
    component.onLogin();
    // Validamos que se llama nuestro servicio mockeado
    expect(spyError).toHaveBeenCalled();
    // Validamos que se llama nuestro toast error
    expect(spyToastError).toHaveBeenCalled();
  });
});
