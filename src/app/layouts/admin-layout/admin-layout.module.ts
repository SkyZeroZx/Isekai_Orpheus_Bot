import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { TramitesComponent } from "../../pages/tramites/tramites.component";
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
import { NgxPaginationModule } from "ngx-pagination";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DocumentosComponent } from "src/app/pages/documentos/documentos.component";
import { UsersComponent } from "src/app/pages/users/users.component";
import { CrearUserComponent } from "src/app/pages/users/crear-user/crear-user.component";
import { EditUserComponent } from "src/app/pages/users/edit-user/edit-user.component";
import { FilterPipeUser } from "src/app/pipes/filterUsers.pipe";
import { FilterDocument } from "src/app/pipes/filterDocument.pipe";
import { NewDocumentComponent } from "src/app/pages/documentos/new-document/new-document.component";
import { EditDocumentComponent } from "src/app/pages/documentos/edit-document/edit-document.component";
import { DetalleTramiteComponent } from "src/app/pages/tramites/components/detalle-tramite/detalle-tramite.component";
import { EditTramiteComponent } from "src/app/pages/tramites/components/edit-tramite/edit-tramite.component";
import { CreateTramiteComponent } from "src/app/pages/tramites/components/create-tramite/create-tramite.component";

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
    ChartsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    SweetAlert2Module.forRoot(),
   
  ],
  providers: [DatePipe],
  declarations: [
    DashboardComponent,
    PieComponent,
    DonutComponent,
    BarComponent,
    TramitesComponent,
    DetalleTramiteComponent,
    EditTramiteComponent,
    CreateTramiteComponent,
    FilterPipe,
    FilterPipeUser,
    FilterDocument,
    UsersComponent,
    CrearUserComponent,
    EditUserComponent,
    DocumentosComponent,
    NewDocumentComponent,
    EditDocumentComponent
  ],
  bootstrap: [DashboardComponent],
})
export class AdminLayoutModule {}
