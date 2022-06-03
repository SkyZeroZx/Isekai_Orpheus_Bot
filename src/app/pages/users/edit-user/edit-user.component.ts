import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
})
export class EditUserComponent implements OnInit {
  // declaramos nuestro FormGroup PARA editarUsuario
  editarUserForm: FormGroup;
  // Recibido el parametro de entra del componente padre usersComponent
  @Input() in_user: any;

  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.crearFormularioEditarUser();
    this.detalleUsuario();
  }

  // Detecta cambio en la variable Input para cargar nuevo tramite seleccionado
  ngOnChanges(_changes: SimpleChanges) {
    this.crearFormularioEditarUser();
    this.detalleUsuario();
  }

  // Asignamos los valores de nuestra variable de entrada in_user a nuestro formulario , in_user viene del componente padre usersComponent
  detalleUsuario() {
    this.editarUserForm.controls.id.setValue(this.in_user.id);
    this.editarUserForm.controls.username.setValue(this.in_user.username);
    this.editarUserForm.controls.nombre.setValue(this.in_user.nombre);
    this.editarUserForm.controls.apellidoPaterno.setValue(
      this.in_user.apellidoPaterno
    );
    this.editarUserForm.controls.apellidoMaterno.setValue(
      this.in_user.apellidoMaterno
    );
    this.editarUserForm.controls.role.setValue(this.in_user.role);
    this.editarUserForm.controls.estado.setValue(this.in_user.estado);
    this.editarUserForm.controls.fechaCreacion.setValue(this.in_user.createdAt);
    this.editarUserForm.controls.fechaModificacion.setValue(
      this.in_user.updateAt
    );
  }
  // Limpiamos y seteamos los valores de nuestros formulario (evitamos espacios en blanco)
  trimEditarUserForm() {
    this.editarUserForm.controls.username.setValue(
      this.editarUserForm.value.username.trim()
    );
    this.editarUserForm.controls.nombre.setValue(
      this.editarUserForm.value.nombre.trim()
    );
    this.editarUserForm.controls.apellidoPaterno.setValue(
      this.editarUserForm.value.apellidoPaterno.trim()
    );
    this.editarUserForm.controls.apellidoMaterno.setValue(
      this.editarUserForm.value.apellidoMaterno.trim()
    );
  }

  // Llamada al servicio updateUser para actualizar nuestro usuario
  actualizarUsuario() {
    this.trimEditarUserForm();
    this.servicios.updateUser(this.editarUserForm.value).subscribe({
      next: (res) => {
        if (res.message == Constant.MENSAJE_OK) {
          this.toastrService.success(
            "Se actualizo exitosamente el usuario",
            "Exito",
            {
              timeOut: 2000,
            }
          );
        } else {
          this.toastrService.error(
            "Sucedio un error al editar : " + res.message,
            "Error",
            {
              timeOut: 3000,
            }
          );
        }
      },
      error: (err) => {
        this.toastrService.error("Error al editar usuario : " + err, "Error", {
          timeOut: 3000,
        });
      },
    });
  }

  // Metodo para creacion de reactiveForm
  crearFormularioEditarUser() {
    this.editarUserForm = this.fb.group({
      id: new FormControl(""),
      username: new FormControl(""),
      nombre: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80),
          Validators.pattern("[A-Za-z ]+"),
        ])
      ),
      apellidoPaterno: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(120),
          Validators.pattern("[A-Za-z ]+"),
        ])
      ),
      apellidoMaterno: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(120),
          Validators.pattern("[A-Za-z ]+"),
        ])
      ),
      role: new FormControl(""),
      estado: new FormControl(""),
      fechaCreacion: new FormControl(""),
      fechaModificacion: new FormControl(""),
    });
  }
}
