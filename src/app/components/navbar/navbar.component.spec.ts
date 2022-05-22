import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/services/auth.service";
import { NavbarComponent } from "./navbar.component";

fdescribe("NavbarComponent", () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let service: AuthService;
  let mockRouter = {
    navigate: jasmine.createSpy("navigate"),
    events: jasmine.createSpy("events"),
  };

  let mockUserAdmin: any = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNCwidXNlcm5hbWUiOiJ0cmFtaXRhZG9yMkBtYWlsLmNvbSIsImlhdCI6MTY1Mjk5MTg1NSwiZXhwIjoxNjUyOTk1NDU1fQ.aqURtej3mSWR7DCGcNRMwIWDauJ_pcRDVgEM06ZQYL4",
    role: "admin",
    username: "administrador@mail.com",
    firstLogin: false,
  };
  let mockUserTramitador: any = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNCwidXNlcm5hbWUiOiJ0cmFtaXRhZG9yMkBtYWlsLmNvbSIsImlhdCI6MTY1Mjk5MTg1NSwiZXhwIjoxNjUyOTk1NDU1fQ.aqURtej3mSWR7DCGcNRMwIWDauJ_pcRDVgEM06ZQYL4",
    role: "tramitador",
    username: "tramitador@mail.com",
    firstLogin: false,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [HttpClientTestingModule, CommonModule, NgbModule],
      providers: [AuthService, { provide: Router, useValue: mockRouter }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(NavbarComponent);
    service = TestBed.inject(AuthService);
    spyOn(service, "getItemToken").and.returnValue("admin");
    localStorage.setItem("user", JSON.stringify(mockUserAdmin));
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Habilitamos en jasmine el re espiar las funciones , caso contrario tendriamos un error
    jasmine.getEnv().allowRespy(true);
  });

  let verifyMenuItemAdmin: any = [
    {
      path: "/dashboard",
      title: "Dashboard",
      icon: "ni-tv-2 text-primary",
      class: "",
    },
    {
      path: "/users",
      title: "Usuarios",
      icon: "fa fa-users",
      class: "",
    },
    {
      path: "/documentos",
      title: "Documentos",
      icon: "ni-bullet-list-67 text-red",
      class: "",
    },
  ];
  let verifyMenuItemTramitador: any = [
    {
      path: "/dashboard",
      title: "Dashboard",
      icon: "ni-tv-2 text-primary",
      class: "",
    },
    {
      path: "/tramites",
      title: "Tramites",
      icon: "ni-bullet-list-67 text-red",
      class: "",
    },
  ];
  it("NavbarComponent creado correctamente", () => {
    expect(component).toBeTruthy();
    localStorage.clear();
    //  expect(spyGetItemToken).toHaveBeenCalled();
  });

  it("Verificamos changePassword()", () => {
    component.changePassword();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/change-password"]);
  });

  it("Verificamos ngOnInit", () => {
    component.ngOnInit();

    expect(component.listTitles).toEqual(verifyMenuItemAdmin);
    expect(component.usuarioLogeado).toEqual(mockUserAdmin.username);
    localStorage.clear();
    //Forzamos a retornar en este caso el valor de tramitador para validar nuestras condiciones
    spyOn(service, "getItemToken").and.returnValue("tramitador")
    localStorage.setItem("user", JSON.stringify(mockUserTramitador));
    component.ngOnInit();
    expect(component.listTitles).toEqual(verifyMenuItemTramitador);
    expect(component.usuarioLogeado).toEqual(mockUserTramitador.username);
  });

  it("Verificamos onLogout()", () => {
    const spyAuth = spyOn(service, "logout").and.callThrough();
    component.onLogout();
    expect(spyAuth).toHaveBeenCalled();
    expect(localStorage.getItem("user")).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
  });
});
