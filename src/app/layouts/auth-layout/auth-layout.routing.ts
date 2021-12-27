import { Routes } from '@angular/router';
import { CheckLogin } from 'src/app/guards/CheckLogin.guard';
import { LoginComponent } from '../../pages/login/login.component';
import { ChangePasswordComponent } from '../../pages/change-password/change-password.component';
import { IsLogged } from 'src/app/guards/IsLogged.guard';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent,canActivate: [CheckLogin] },
    { path: 'change-password',       component: ChangePasswordComponent ,canActivate: [IsLogged]}
];
