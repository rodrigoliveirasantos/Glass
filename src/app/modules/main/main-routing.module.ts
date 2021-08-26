import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';

const routes: Routes = [
  { path: '', component: LoadingScreenComponent },
  { path: 'schedules', component: MainScreenComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }