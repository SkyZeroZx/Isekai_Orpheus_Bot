import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class FirstLogin implements CanActivate {
  constructor(private router: Router) {}
  // Validamos si es primer login del usuario , si es primer login lo mandamos a cambiar contraseña
  canActivate() {
    console.log("Guard First Login");
    if (JSON.parse(localStorage.getItem("user")) == null) {
      return false;
    }
    if (JSON.parse(localStorage.getItem("user")).firstLogin) {
      this.router.navigate(["/change-password"]);
    } else {
      return true;
    }
  }
}
