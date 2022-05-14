import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { tramitesComponent } from "../../pages/tramites/tramites.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule } from "ng2-charts";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { esLocale } from "ngx-bootstrap/locale";
import { PieComponent } from "src/app/pages/dashboard/graficos/pie/pie.component";
import { DonutComponent } from "src/app/pages/dashboard/graficos/donut/donut.component";
import { BarComponent } from "src/app/pages/dashboard/graficos/bar/bar.component";
import { FilterPipe } from "src/app/pipes/filter.pipe";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { DetalletramiteComponent } from "src/app/pages/tramites/detalles/detalletramite/detalletramite.component";
import { NgxPaginationModule } from "ngx-pagination";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DocumentosComponent } from "src/app/pages/documentos/documentos.component";
import { UsersComponent } from "src/app/pages/users/users.component";


defineLocale("es", esLocale);
@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ChartsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [DatePipe],
  declarations: [
    DashboardComponent,
    DetalletramiteComponent,
    PieComponent,
    DonutComponent,
    BarComponent,
    tramitesComponent,
    FilterPipe,
    DocumentosComponent,
    UsersComponent
  ],
  bootstrap: [DashboardComponent],
})
export class AdminLayoutModule {}
