import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { UserResponse } from "src/app/entities/user";
import { ReporteService } from "src/app/services/report.service";
import { ServiciosService } from "src/app/services/servicios.service";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  usuarioForm: FormGroup;
  listaUsuarios: UserResponse[];
  userSeleccionado: UserResponse;
  // Variable booleas que controlar el mostrar la lista y componente hijos
  listaUsuariosOk: boolean = false;
  crearUsuarioOK: boolean = false;
  editUsuarioOK: boolean = false;
  p = 1;

  @ViewChild("modalEditUser", { static: false })
  public modalEditUser: ModalDirective;
  @ViewChild("modalNewUser", { static: false })
  public modalNewUser: ModalDirective;
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    this.crearFormularioConsulta();
    this.listarUsuarios();
  }

  // Metodo para creacion de reactiveForm
  crearFormularioConsulta() {
    this.usuarioForm = this.fb.group({
      filterCodUser: new FormControl(""),
      filterEmailUser: new FormControl(""),
      filterRolUser: new FormControl(""),
      filterNombreUser: new FormControl(""),
      filterPaternoUser: new FormControl(""),
      filterMaternoUser: new FormControl(""),
      filterEstado: new FormControl(""),
    });
  }
  exportarExcel() {
    // Eliminamos los elementos que no deseamos mostrar en el reporte
    Constant.REPORT.forEach(
      (res) => (delete res.password, delete res.firstLogin)
    );
    this.reporteService.exportAsExcelFile("REPORTE USUARIOS");
  }

  exportarPDF() {
    // Eliminamos los elementos que no deseamos mostrar en el reporte
    Constant.REPORT.forEach(
      (res) => (delete res.password, delete res.firstLogin)
    );
    const encabezado = [
      "CODIGO",
      "EMAIL",
      "ROL",
      "CREACION",
      "MODIFICACION",
      "NOMBRES",
      "APELLIDO PATERNO",
      "APELLIDO MATERNO",
      "ESTADO",
    ];
    this.reporteService.exportAsPDF("REPORTE USUARIOS", encabezado);
  }

  // Metodo que llama al modal componente hijo edituser
  editarUsuario(user) {
    this.userSeleccionado = user;
    this.modalEditUser.show();
    this.editUsuarioOK = true;
  }

  onChangeForm() {
    this.p = 1;
  }

  // Metodo que llama al servicio getAllUsers
  listarUsuarios() {
    this.servicios.getAllUsers().subscribe({
      next: (res) => {
        console.log("Lista Usuarios ", res);
        this.listaUsuariosOk = true;
        this.listaUsuarios = res;
      },
      error: (err) => {
        console.log("Error listarUsuarios ", err);
        this.toastrService.error("Error al listar usuarios", "Error", {
          timeOut: 3000,
        });
      },
    });
  }

  // Llamada al servicio resetear contraseña
  resetearUsuario(user) {
    this.servicios.resetPassword(user).subscribe({
      next: (res) => {
        console.log("Resetea password ", res);
        switch (res.message) {
          case Constant.MENSAJE_OK:
            this.listarUsuarios();
            this.toastrService.success(
              "Se reseteo exitosamente la contraseña",
              "Exito",
              {
                timeOut: 3000,
              }
            );
            break;
          default:
            this.toastrService.error(
              "Sucedio un error al resetear la contraseña " + res.message,
              "Error",
              {
                timeOut: 3000,
              }
            );
            break;
        }
      },
      error: (err) => {
        console.log("Error resetearUsuario ", err);
        this.toastrService.error(
          "Sucedio un error al resetear el usuario",
          "Error",
          {
            timeOut: 3000,
          }
        );
      },
    });
  }

  // Metodo que llama al servicio eliminar usuario
  eliminarUsuario(id) {
    this.servicios.deleteUser(id).subscribe({
      next: (res) => {
        switch (res.message) {
          case Constant.MENSAJE_OK:
            this.listarUsuarios();
            this.p = 1;
            this.toastrService.success(
              "Se elimino exitosamente el usuario",
              "Exito",
              {
                timeOut: 3000,
              }
            );
            break;
          default:
            this.toastrService.error(
              "Sucedio un error al eliminar al usuario e: " + res.message,
              "Error",
              {
                timeOut: 3000,
              }
            );
            break;
        }
      },
      error: (err) => {
        console.log("Error eliminarUsuario ", err);
        this.toastrService.error(
          "Sucedio un error al eliminar el usuario",
          "Error",
          {
            timeOut: 3000,
          }
        );
      },
    });
  }

  // Metodo que llama al componente modal hijo crear user
  crearUsuario() {
    this.modalNewUser.show();
    this.crearUsuarioOK = true;
  }

  // Alerta de reseteo de usuario
  alertResetUser(username) {
    Swal.fire({
      title: "Reseteo de contraseña de usuario",
      text:
        "Se va resetear la contraseña del usuario " +
        username +
        " ¿Esta seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Caso de aceptar se llama al servicio de reseteo de contraseña de usuario y se envie el email respectivo
        const user = {
          username: username,
        };
        this.resetearUsuario(user);
      }
    });
  }

  // Alerta de eliminacion de usuario
  alertDeleteUser(user) {
    Swal.fire({
      title: "Eliminar Usuario",
      text: "Se va eliminar al usuario " + user.username + " ¿Esta seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Caso de aceptar se llama al servicio de eliminar usuario
        this.eliminarUsuario(user.id);
      }
    });
  }
}
