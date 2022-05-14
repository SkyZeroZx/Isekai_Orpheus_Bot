import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
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
  }
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
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
    this.usuarioLogeado = localStorage.getItem("usuarioLogueado");
  }
  
  onLogout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }

  changePassword() {
    console.log("change password");
  }
}
