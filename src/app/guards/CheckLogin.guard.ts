import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { UserResponse } from "../entities/user";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class CheckLogin implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    console.log("Auth Guard Check Login");
    if (localStorage.getItem("usuarioLogueado") === null) {
    } else if (this.router.url === "/") {
      console.log("Usuario logeado es diferente de null");
      this.router.navigate(["/dashboard"]);
    }

    return this.authService.user$.pipe(
      take(1),
      map((user: UserResponse) => (!user ? true : false))
    );
  }
}
