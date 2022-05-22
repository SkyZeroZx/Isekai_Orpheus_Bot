import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { Constant } from "src/app/Constants/Constant";
import { AuthLayoutRoutes } from "src/app/layouts/auth-layout/auth-layout.routing";
import { AuthService } from "src/app/services/auth.service";

import { ChangePasswordComponent } from "./change-password.component";

fdescribe("ChangePasswordComponent", () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let auth: AuthService;
  let toast: ToastrService;
  let mockRouter = {
    navigate: jasmine.createSpy("navigate"),
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
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
    localStorage.clear();
    fixture = TestBed.createComponent(ChangePasswordComponent);
    auth = TestBed.inject(AuthService);
    toast = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Habilitamos en jasmine el re espiar las funciones , caso contrario tendriamos un error
    jasmine.getEnv().allowRespy(true);
  });

  it("ChangePasswordComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Verificamos ngOnInit()", () => {
    // espiamos nuestra funcion crearFormChangePassword
    const spyCrearFormChangePassword = spyOn(
      component,
      "crearFormChangePassword"
    ).and.callThrough();
    // Llamamos nuestra funcion a evaluar
    component.ngOnInit();
    // Validamos que se llame nuestro espia
    expect(spyCrearFormChangePassword).toHaveBeenCalled();
  });

  it("Verificamos showPassword(i)", () => {
    // Validamos los caso de old password , new password y confirm password
    for (let i = 0; i < 3; i++) {
      component.showPassword(i);
      expect(component.show_button[i]).toBeTruthy();
      expect(component.show_eye[i]).toBeTruthy();
    }
  });

  it("Verificamos onChangePassword()", () => {
    // Validamos la condicion cuando   new password y confirm password son diferentes
    component.changePasswordForm.controls.newPassword.setValue("NewPassword1");
    component.changePasswordForm.controls.confirmedPassword.setValue(
      "NewPassword2"
    );
    component.onChangePassword();
    expect(component.diferent).toBeTruthy();
    // Validamos para cuando son iguales oldPassword
    component.changePasswordForm.controls.oldPassword.setValue("NewPassword");
    component.changePasswordForm.controls.newPassword.setValue("NewPassword");
    component.changePasswordForm.controls.confirmedPassword.setValue(
      "NewPassword"
    );
    component.onChangePassword();
    expect(component.diferent).toBeFalsy();
    // Preparamos nuestro mock para el response del servicio
    const mockResponse: any = {
      message: Constant.MENSAJE_OK,
    };
    // Espiamos nuestro servicio y hace devuelva un MENSAJE_OK
    const spyChangePassword = spyOn(auth, "changePassword").and.returnValue(
      of(mockResponse)
    );
    const spyToast = spyOn(toast, "success").and.callThrough();
    let mockUserAdmin: any = {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNCwidXNlcm5hbWUiOiJ0cmFtaXRhZG9yMkBtYWlsLmNvbSIsImlhdCI6MTY1Mjk5MTg1NSwiZXhwIjoxNjUyOTk1NDU1fQ.aqURtej3mSWR7DCGcNRMwIWDauJ_pcRDVgEM06ZQYL4",
      role: "admin",
      username: "administrador@mail.com",
      firstLogin: false,
    };

    localStorage.setItem("user", JSON.stringify(mockUserAdmin));

    component.onChangePassword();
    // Validamos que sea llamado nuestro espia
    expect(spyChangePassword).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalled();
    // Validamos que navegamos
    expect(mockRouter.navigate).toHaveBeenCalled();
    // Validamos que firstLogin sea false
    expect(JSON.parse(localStorage.getItem("user")).firstLogin).toBe(false);
    localStorage.clear();

    // Validamos para el caso que sea el primer login
    const spyGetItemTokenTrueFirstLogin = spyOn(
      auth,
      "getItemToken"
    ).and.returnValue(true);
    component.onChangePassword();
    expect(spyGetItemTokenTrueFirstLogin).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);

    // Espiamos nuestro servicio y hace devuelva un DIFERENTE de  MENSAJE_OK
    // Creamos el mock de nuestro objeto
    const mockDiferent = {
      message: "Algo salio mal",
    };
    const spyToastErr = spyOn(toast, "error").and.callThrough();
    const spyChangePasswordDif = spyOn(auth, "changePassword").and.returnValue(
      of(mockDiferent)
    );
    component.onChangePassword();
    // Validamos que sea llamado nuestro espia
    expect(spyChangePasswordDif).toHaveBeenCalled();
    expect(spyToastErr).toHaveBeenCalled();

    // Verificamos  para el caso que el servicio login nos retorne un error
    const spyToastError = spyOn(toast, "error").and.callThrough();
    const spyError = spyOn(auth, "changePassword").and.returnValue(
      throwError(() => new Error("Error en el servicio changePassword"))
    );
    component.onChangePassword();
    // Validamos que sea llamado nuestro espia
    expect(spyToastError).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it("Verificamos retrocederFirstLogin()", () => {
    // validamos para el caso que es primer login
    const spyGetItemTokenTrue = spyOn(auth, "getItemToken").and.returnValue(
      true
    );
    const spyauthService = spyOn(auth, "logout").and.callThrough();
    // Llamamos nuestra funcion a evaluar
    component.retrocederFirstLogin();
    // validamos las condiciones
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
    expect(spyGetItemTokenTrue).toHaveBeenCalled();
    expect(spyauthService).toHaveBeenCalled();
    // Validamos en caso contrario
    const spyGetItemTokenFalse = spyOn(auth, "getItemToken").and.returnValue(
      false
    );
    // Llamamos nuestra funcion a evaluar
    component.retrocederFirstLogin();
    // validamos las condiciones
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/dashboard"]);
    expect(spyGetItemTokenFalse).toHaveBeenCalled();
  });
});
