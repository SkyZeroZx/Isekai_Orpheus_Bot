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
        Validators.maxLength(50)
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
    this.authService.login(formValue).subscribe({
      next: (res) => {
        // Segun response realizamos una accion
        switch (res.message) {
          case "Username or password incorrect!":
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
          case "OK":
            localStorage.setItem("usuarioLogueado", formValue.username);
            this.router.navigate(["/dashboard"]);
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
        console.log("Error en listarTramiteDoc ", err);
        this.toastrService.error("Error al logearse", "Error", {
          timeOut: 3000,
        });
      },
    });
  }
}
