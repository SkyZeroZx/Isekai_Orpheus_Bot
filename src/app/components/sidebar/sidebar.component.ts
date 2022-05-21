import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES_TRAMITADOR: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "ni-tv-2 text-primary",
    class: "",
  },
  {
    path: "/tramites",
    title: "Tramites",
    icon: "ni-bullet-list-67 text-red",
    class: "",
  },
];

export const ROUTES_ADMINISTRADOR: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "ni-tv-2 text-primary",
    class: "",
  },
  {
    path: "/users",
    title: "Usuarios",
    icon: "fa fa-users",
    class: "",
  },
  {
    path: "/documentos",
    title: "Documentos",
    icon: "ni-bullet-list-67 text-red",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  usuarioLogeado: string;
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    switch (JSON.parse(localStorage.getItem("user")).role) {
      case "admin":
        this.menuItems = ROUTES_ADMINISTRADOR.filter((menuItem) => menuItem);
        break;
      case "tramitador":
        this.menuItems = ROUTES_TRAMITADOR.filter((menuItem) => menuItem);
        break;
      default:
        break;
    }
    this.usuarioLogeado = JSON.parse(localStorage.getItem("user")).username;
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
    localStorage.clear();
  }

  changePassword() {
    this.router.navigate(["/change-password"]);
  }
}
