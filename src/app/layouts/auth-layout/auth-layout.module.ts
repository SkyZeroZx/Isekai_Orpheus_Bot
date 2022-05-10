import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from '../../pages/login/login.component';
import { ChangePasswordComponent } from '../../pages/change-password/change-password.component';
import { TrackingComponent } from 'src/app/pages/tracking/tracking.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
@NgModule({
  imports: [ 
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    // NgbModule
  ],
  declarations: [
    LoginComponent,
    TrackingComponent,
    ChangePasswordComponent
  ]
})
export class AuthLayoutModule { }
