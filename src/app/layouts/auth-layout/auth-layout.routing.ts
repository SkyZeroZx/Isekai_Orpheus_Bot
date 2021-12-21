import { Routes } from '@angular/router';
import { CheckLogin } from 'src/app/guards/CheckLogin.guard';
import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent,canActivate: [CheckLogin] },
    { path: 'register',       component: RegisterComponent }
];
