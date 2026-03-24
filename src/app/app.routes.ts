import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'analytics',
        component: DashboardComponent,
      },
      {
        path: 'products',
        component: DashboardComponent,
      },
      {
        path: 'users',
        component: DashboardComponent,
      },
      {
        path: 'settings',
        component: DashboardComponent,
      },
      {
        path: 'help',
        component: DashboardComponent,
      },
    ],
  },
];
