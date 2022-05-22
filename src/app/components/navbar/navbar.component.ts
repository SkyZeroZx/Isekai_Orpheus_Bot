import { Component, OnInit, ElementRef } from "@angular/core";
import {
  ROUTES_ADMINISTRADOR,
  ROUTES_TRAMITADOR,
} from "../sidebar/sidebar.component";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  usuarioLogeado: string;
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private auth: AuthService
  ) {
    this.location = location;
  }

  ngOnInit() {
    switch (this.auth.getItemToken("role")) {
      case "admin":
        this.listTitles = ROUTES_ADMINISTRADOR.filter((listTitle) => listTitle);
        break;
      case "tramitador":
        this.listTitles = ROUTES_TRAMITADOR.filter((listTitle) => listTitle);
        break;
      default:
        break;
    }

    this.usuarioLogeado = JSON.parse(localStorage.getItem("user")).username;
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    for (let value of this.listTitles) {
      if (value.path === titlee) {
        return value.title;
      }
    }
  }

  onLogout() {
    console.log("logout");
    this.auth.logout();
    this.router.navigate(["/login"]);
    localStorage.clear();
  }

  changePassword() {
    this.router.navigate(["/change-password"]);
  }
}
