import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { tramitesComponent } from '../../pages/tramites/tramites.component';
import { IsLogged } from 'src/app/guards/IsLogged.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent,canActivate: [IsLogged] },
    { path: 'user-profile',   component: UserProfileComponent ,canActivate: [IsLogged]},
    { path: 'tramites',         component: tramitesComponent,canActivate: [IsLogged] },
    { path: 'icons',          component: IconsComponent ,canActivate: [IsLogged]},
    { path: 'maps',           component: MapsComponent ,canActivate: [IsLogged]}
];
