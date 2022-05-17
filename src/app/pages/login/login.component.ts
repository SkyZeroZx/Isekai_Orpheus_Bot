import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  //Al renderizar componente creamos el formulario
  ngOnInit() {
    localStorage.clear();
    this.crearFormularioLogin();
  }

  //Creamos nuestro reactiveForm para Login
  crearFormularioLogin() {
    //Creamos validaciones respectiva para nuestro ReactiveForm
    this.loginForm = this.fb.group({
      username: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.maxLength(50),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  // Llamada al servicio Login
  onLogin() {
    const formValue = this.loginForm.value;
    console.log(formValue);
    this.authService.login(formValue).subscribe({
      next: (res) => {
        // Segun response realizamos una accion
        console.log(res);
        switch (res.message) {
          case "Username or password incorrect!":
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
          case "OK":
            if (res.firstLogin) {
              // Es tu primer login modal debes cambiar tu contraseña aceptar o rechazar
              this.alertFirstLogin();
            } else {
              this.router.navigate(["/dashboard"]);
            }
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
        //En caso de error
        console.log("Error en onLogin ", err);
        this.toastrService.error("Error al logearse Z", "Error", {
          timeOut: 3000,
        });
      },
    });
  }

  // Alerta de advertencia al ser primerlogin
  alertFirstLogin() {
    Swal.fire({
      title: "Es su primer login",
      text: "Se recomienda cambiar su contraseña",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Caso de aceptar se redirije a change-password
        this.router.navigate(["/change-password"]);
      } else {
        // En caso contrario limpiamos localstorage
        localStorage.clear();
      }
    });
  }
}
