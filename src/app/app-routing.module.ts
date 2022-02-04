import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth-guard.service';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'connect',
        loadChildren: () => import('./connect/connect.module').then((m) => m.ConnectModule),
      },
      {
        path: 'network',
        loadChildren: () => import('./network/network.module').then((m) => m.NetworkModule),
      },
      {
        path: 'inbox',
        loadChildren: () => import('./inbox/inbox.module').then((m) => m.InboxModule),
      },
      {
        path: 'inbox/:id',
        loadChildren: () => import('./inbox/inbox.module').then((m) => m.InboxModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      { path: '**', redirectTo: '/connect', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
