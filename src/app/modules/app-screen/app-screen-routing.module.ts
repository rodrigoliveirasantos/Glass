import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { CanStartAppGuard } from './Guards/can-start-app.guard';

const routes: Routes = [
  {
    path: '',
    component: MainScreenComponent,
    canActivate: [CanStartAppGuard],
    children: [
      { path: 'calendario', loadChildren: () => import('../main/main.module').then(m => m.MainModule) },
      { path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) }
    ],
  },
  { path: 'loading', component: LoadingScreenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppScreenRoutingModule { }
