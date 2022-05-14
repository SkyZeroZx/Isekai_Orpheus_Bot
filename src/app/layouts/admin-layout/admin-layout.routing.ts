import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { tramitesComponent } from '../../pages/tramites/tramites.component';
import { IsLogged } from 'src/app/guards/IsLogged.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent,canActivate: [IsLogged] },
    { path: 'tramites',         component: tramitesComponent,canActivate: [IsLogged] }
];
