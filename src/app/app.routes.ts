import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { UsersComponent } from './pages/users/users.component';
import { DemoTableComponent } from './layout/demo-table/demo-table.component';
import { LoginComponent } from './auth/login/login.component';
import { BcdrrequestComponent } from './pages/bcdrrequest/bcdrrequest.component';
import { AuthGuard } from './core/guards/auth.guard';


export const APP_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
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
        component: BcdrrequestComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'settings',
        component: UserFormComponent,
      },
      {
        path: 'help',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
