import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { tramitesComponent } from "../../pages/tramites/tramites.component";
import { IsLogged } from "src/app/guards/IsLogged.guard";
import { DocumentosComponent } from "src/app/pages/documentos/documentos.component";
import { checkRole } from "src/app/guards/checkRole.guard";
import { UsersComponent } from "src/app/pages/users/users.component";
import { FirstLogin } from "src/app/guards/FirstLogin.guard";

export const AdminLayoutRoutes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [FirstLogin, checkRole, IsLogged],
  },
  {
    path: "tramites",
    component: tramitesComponent,
    canActivate: [FirstLogin, checkRole, IsLogged],
  },
  {
    path: "documentos",
    component: DocumentosComponent,
    canActivate: [FirstLogin, checkRole, IsLogged],
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [FirstLogin, checkRole, IsLogged],
  },
];
