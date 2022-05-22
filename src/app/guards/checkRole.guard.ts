import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "../services/auth.service";
const helper = new JwtHelperService();
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
    switch (this.authService.getItemToken("role")) {
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
