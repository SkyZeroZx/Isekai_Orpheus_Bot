import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ChangePassword } from "src/app/entities/user";
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
          case "Password change!":
            this.router.navigate(["/dashboard"]);
            this.toastrService.success(res.message, "Exito", {
              timeOut: 2000,
            });
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
        console.log("Error ChangePassword ", err);
        this.toastrService.error("Error al cambiar contraseña", "Error", {
          timeOut: 5000,
        });
      },
    });
  }
}
