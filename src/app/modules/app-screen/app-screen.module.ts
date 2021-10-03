import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminModule } from '../admin/admin.module';
import { MainModule } from '../main/main.module';
import { SharedModule } from '../shared/shared.module';
import { AppScreenRoutingModule } from './app-screen-routing.module';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';



@NgModule({
  declarations: [
    MainScreenComponent,
    LoadingScreenComponent
  ],
  imports: [
    CommonModule,
    AppScreenRoutingModule,
    SharedModule,
    MainModule,
    AdminModule
  ]
})
export class AppScreenModule { }
