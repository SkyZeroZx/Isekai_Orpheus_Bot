import { Routes } from "@angular/router";
import { CheckLogin } from "src/app/guards/CheckLogin.guard";
import { LoginComponent } from "../../pages/login/login.component";
import { ChangePasswordComponent } from "../../pages/change-password/change-password.component";
import { IsLogged } from "src/app/guards/IsLogged.guard";
import { TrackingComponent } from "src/app/pages/tracking/tracking.component";

export const AuthLayoutRoutes: Routes = [
  { path: "tracking", component: TrackingComponent },
  { path: "login", component: LoginComponent, canActivate: [CheckLogin] },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [IsLogged],
  },
];
