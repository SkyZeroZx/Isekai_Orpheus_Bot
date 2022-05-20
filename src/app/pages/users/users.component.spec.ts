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
import { UsersComponent } from "./users.component";

fdescribe("UsersComponent", () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let servicio: ServiciosService;
  let reporteService: ReporteService;
  let toastrService: ToastrService;
  const mockReport: any = [
    {
      id: 15,
      username: "test@mail.com",
      role: "admin",
      createdAt: "2021-12-26T22:12:58.526Z",
      updateAt: "2022-05-15T20:23:50.000Z",
      nombre: "Nuevo Edit",
      apellidoPaterno: "Paterno edit",
      apellidoMaterno: "Materno edit",
      estado: "RESETEADO",
    },
    {
      id: 24,
      username: "test2@mail.com",
      role: "admin",
      createdAt: "2022-04-24T05:35:08.818Z",
      updateAt: "2022-05-15T16:43:21.000Z",
      nombre: "NOMBRE TEST",
      apellidoPaterno: "apellidoPaterno TEST",
      apellidoMaterno: "apellidoMaterno TEST",
      estado: "RESETEADO",
    },
  ];
  const mockUser: any = {
    id: 15,
    username: "test@mail.com",
    role: "admin",
    createdAt: "2021-12-26T22:12:58.526Z",
    updateAt: "2022-05-15T20:23:50.000Z",
    nombre: "Nuevo Edit",
    apellidoPaterno: "Paterno edit",
    apellidoMaterno: "Materno edit",
    estado: "RESETEADO",
    firstLogin: true,
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
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
    fixture = TestBed.createComponent(UsersComponent);
    reporteService = TestBed.inject(ReporteService);
    servicio = TestBed.inject(ServiciosService);
    toastrService = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("UsersComponent creado correctamente", () => {
    expect(component).toBeTruthy();
  });

  it("Validamos ngOnInit()", () => {
    const spycrearFormularioConsulta = spyOn(
      component,
      "crearFormularioConsulta"
    ).and.callThrough();
    const spylistarUsuarios = spyOn(
      component,
      "listarUsuarios"
    ).and.callThrough();
    component.ngOnInit();
    expect(spycrearFormularioConsulta).toHaveBeenCalled();
    expect(spylistarUsuarios).toHaveBeenCalled();
  });

  it("Verificamos exportarExcel()", () => {
    Constant.REPORT = mockReport;
    const spyexportAsExcelFile = spyOn(
      reporteService,
      "exportAsExcelFile"
    ).and.callThrough();
    component.exportarExcel();
    expect(spyexportAsExcelFile).toHaveBeenCalled();
  });

  it("Verificamos exportarPDF()", () => {
    Constant.REPORT = mockReport;
    const spyexportAsPDF = spyOn(
      reporteService,
      "exportAsPDF"
    ).and.callThrough();
    component.exportarPDF();
    expect(spyexportAsPDF).toHaveBeenCalled();
  });

  it("Verificamos onChangeForm()", () => {
    component.onChangeForm();
    expect(component.p).toEqual(1);
  });

  it("Verificamos editarUsuario()", () => {
    const spyModalEditUser = spyOn(
      component.modalEditUser,
      "show"
    ).and.callThrough();
    component.editarUsuario(mockUser);
    expect(component.userSeleccionado).toEqual(mockUser);
    expect(component.editUsuarioOK).toBeTruthy();
    expect(spyModalEditUser).toHaveBeenCalled();
  });

  it("Verificamos listarUsuarios()", () => {
    const spygetAllUsers = spyOn(servicio, "getAllUsers").and.returnValue(
      of(mockReport)
    );
    component.listarUsuarios();
    expect(spygetAllUsers).toHaveBeenCalled();
    expect(component.listaUsuariosOk).toBeTruthy();
    expect(component.listaUsuarios).toEqual(mockReport);

    //Validamos para cuando el servicio retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyError = spyOn(servicio, "getAllUsers").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    component.listarUsuarios();
    expect(spyToastError).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it("Verificamos crearUsuario()", () => {
    const spymodalNewUser = spyOn(
      component.modalNewUser,
      "show"
    ).and.callThrough();
    component.crearUsuario();
    expect(spymodalNewUser).toHaveBeenCalled();
    expect(component.crearUsuarioOK).toBeTruthy();
  });

  it("Verificamos resetearUsuario()", () => {
    //Validamos cuando la respuesta del servicio es MENSAJE_OK
    const mockResOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spylistarUsuarios = spyOn(
      component,
      "listarUsuarios"
    ).and.callThrough();
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    const spyResetOK = spyOn(servicio, "resetPassword").and.returnValue(
      of(mockResOK)
    );
    component.resetearUsuario(mockUser);
    expect(spyToastSucess).toHaveBeenCalled();
    expect(spylistarUsuarios).toHaveBeenCalled();
    expect(spyResetOK).toHaveBeenCalled();

    // Validamos para cuando el servicio responda diferente de MENSAJE_OK
    const mockResDif: any = {
      message: "something",
    };
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();

    const spyResetDif = spyOn(servicio, "resetPassword").and.returnValue(
      of(mockResDif)
    );
    component.resetearUsuario(mockUser);
    expect(spyResetDif).toHaveBeenCalled();
    expect(spyToastErr).toHaveBeenCalled();

    //Validamos para cuando el servicio retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spyError = spyOn(servicio, "resetPassword").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    component.resetearUsuario(mockUser);
    expect(spyToastError).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it("Verificamos eliminarUsuario()", () => {
    //Validamos cuando la respuesta del servicio es MENSAJE_OK
    const mockResOK: any = {
      message: Constant.MENSAJE_OK,
    };
    const spylistarUsuarios = spyOn(
      component,
      "listarUsuarios"
    ).and.callThrough();
    const spyToastSucess = spyOn(toastrService, "success").and.callThrough();
    const spydeleteUserOK = spyOn(servicio, "deleteUser").and.returnValue(
      of(mockResOK)
    );
    component.eliminarUsuario(1);
    expect(spyToastSucess).toHaveBeenCalled();
    expect(spylistarUsuarios).toHaveBeenCalled();
    expect(component.p).toEqual(1);
    expect(spydeleteUserOK).toHaveBeenCalled();

    // Validamos para cuando el servicio responda diferente de MENSAJE_OK
    const mockResDif: any = {
      message: "something",
    };
    const spyToastErr = spyOn(toastrService, "error").and.callThrough();

    const spyResetDif = spyOn(servicio, "deleteUser").and.returnValue(
      of(mockResDif)
    );
    component.eliminarUsuario(2);
    expect(spyResetDif).toHaveBeenCalled();
    expect(spyToastErr).toHaveBeenCalled();

    //Validamos para cuando el servicio retorna un error
    const spyToastError = spyOn(toastrService, "error").and.callThrough();
    const spydeleteUserError = spyOn(servicio, "deleteUser").and.returnValue(
      throwError(() => new Error("Error en el servicio"))
    );
    component.eliminarUsuario(3);
    expect(spyToastError).toHaveBeenCalled();
    expect(spydeleteUserError).toHaveBeenCalled();
  });

  it("Verificamos alertResetUser(user)", async () => {
    let user;
    const spyresetearUsuario = spyOn(
      component,
      "resetearUsuario"
    ).and.callThrough();
    // Llamamos nuestro component de sweetalert2 de primerlogin
    await component.alertResetUser(user);
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // validamos el titulo
    await expect(Swal.getTitle().textContent).toEqual(
      "Reseteo de contraseña de usuario"
    );
    // Realizamos click en confirm
    await Swal.clickConfirm();
    expect(spyresetearUsuario).toHaveBeenCalled();
    // Validamos el caso contrario
    await component.alertResetUser(user);
    await Swal.clickDeny();
    await expect(spyresetearUsuario).toHaveBeenCalledTimes(1);
  });

  it("Verificamos alertDeleteUser(user)", async () => {
    const spyeliminarUsuario = spyOn(
      component,
      "eliminarUsuario"
    ).and.callThrough();
    // Llamamos nuestro component de sweetalert2 de primerlogin
    await component.alertDeleteUser(mockUser);
    //Validamos la visibilidad
    await expect(Swal.isVisible()).toBeTruthy();
    // validamos el titulo
    await expect(Swal.getTitle().textContent).toEqual("Eliminar Usuario");
    // Realizamos click en confirm
    await Swal.clickConfirm();
    expect(spyeliminarUsuario).toHaveBeenCalled();
    // Validamos el caso contrario
    await component.alertDeleteUser(mockUser);
    await Swal.clickDeny();
    await expect(spyeliminarUsuario).toHaveBeenCalledTimes(1);
  });
});
