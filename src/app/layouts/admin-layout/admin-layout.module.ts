import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
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
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
defineLocale("es", esLocale);
@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ChartsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
  ],
  providers: [DatePipe, { provide: ToastrService, useClass: ToastrService }],
  declarations: [
    DashboardComponent,
    DetalletramiteComponent,
    PieComponent,
    DonutComponent,
    BarComponent,
    UserProfileComponent,
    tramitesComponent,
    IconsComponent,
    MapsComponent,
    FilterPipe,
  ],
  bootstrap: [DashboardComponent],
})
export class AdminLayoutModule {}
