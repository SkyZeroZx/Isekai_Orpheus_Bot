import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { LoginComponent } from '../../pages/login/login.component';
import { ChangePasswordComponent } from '../../pages/change-password/change-password.component';
import { TrackingComponent } from 'src/app/pages/tracking/tracking.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalDirective, ModalModule } from "ngx-bootstrap/modal";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ChartsModule } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
 

@NgModule({
  imports: [ 
    CommonModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    TrackingComponent,
    ChangePasswordComponent
  ]
 
})
export class AuthLayoutModule { }
