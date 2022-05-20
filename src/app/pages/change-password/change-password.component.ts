import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { AuthService } from "src/app/services/auth.service";
 
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  //Variable booleana para validacion de password el cambio de contraseña (OldPassword & NewPassword)
  diferent: boolean = false;
  // Arreglo de variables booleanas para mostrar el password segun se requiera
  show_button: Boolean[] = [false, false, false];
  show_eye: Boolean[] = [false, false, false];
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  //Inicializamos el formulario al renderizar el componente
  ngOnInit() {
    this.crearFormChangePassword();
  }

  // Creamos el formulario changePassword
  crearFormChangePassword() {
    // Asignamos las validaciones al formulario
    this.changePasswordForm = this.fb.group({
      oldPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmedPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  // Se muestra password segun requierimiento de la posicion old , new y confirm password
  showPassword(i) {
    switch (i) {
      case 0:
        this.show_button[0] = !this.show_button[0];
        this.show_eye[0] = !this.show_eye[0];
        break;
      case 1:
        this.show_button[1] = !this.show_button[1];
        this.show_eye[1] = !this.show_eye[1];
        break;
      case 2:
        this.show_button[2] = !this.show_button[2];
        this.show_eye[2] = !this.show_eye[2];
        break;
    }
  }

  onChangePassword() {
    this.diferent = false;
    if (
      this.changePasswordForm.value.newPassword !==
      this.changePasswordForm.value.confirmedPassword
    ) {
      this.diferent = true;
      return;
    }

    this.authService.changePassword(this.changePasswordForm.value).subscribe({
      next: (res) => {
        switch (res.message) {
          case Constant.MENSAJE_OK:
            this.router.navigate(["/dashboard"]);
            // Actualizamos el localstorage por si es un primer login
            let newStorage = JSON.parse(localStorage.getItem("user"));
            newStorage.firstLogin = false;
            localStorage.setItem("user", JSON.stringify(newStorage));
            this.toastrService.success(
              "Se cambio con exitosa la contraseña",
              "Exito",
              {
                timeOut: 3000,
              }
            );
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
     //   console.log("Error ChangePassword ", err);
        this.toastrService.error("Error al cambiar contraseña" +err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  retrocederFirstLogin() {
    this.router.navigate(["/login"]);
  }
}
