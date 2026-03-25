import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { UsersComponent } from './pages/users/users.component';
import { DemoTableComponent } from './layout/demo-table/demo-table.component';

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
        component: DemoTableComponent,
      },
      {
        path: 'products',
        component: DashboardComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
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
