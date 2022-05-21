import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class CheckRole implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    console.log("Check Role");
    console.log(window.location.href);
    if (JSON.parse(localStorage.getItem("user")) == null) {
      return false;
    }
    switch (JSON.parse(localStorage.getItem("user")).role) {
      case "admin":
        if (window.location.href.includes("tramites")) {
          this.router.navigate(["/dashboard"]);
          return false;
        } else {
          return true;
        }
      case "tramitador":
        if (
          window.location.href.includes("documentos") ||
          window.location.href.includes("users")
        ) {
          this.router.navigate(["/dashboard"]);
          return false;
        } else {
          return true;
        }
      default:
        return false;
    }
  }
}
