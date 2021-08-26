import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [
    LoginScreenComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule
  ],
  bootstrap: [
    LoginScreenComponent
  ],
  providers: [],
})
export class LoginModule { }
