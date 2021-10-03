import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AsideComponent } from './components/aside/aside.component';
import { ModalComponent } from './components/modal/modal.component';



@NgModule({
  declarations: [
    ModalComponent,
    AsideComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    AsideComponent
  ]
})
export class SharedsModule { }
