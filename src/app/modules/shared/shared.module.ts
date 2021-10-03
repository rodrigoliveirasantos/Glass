import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/modules/shared/pipes/safe.pipe';
import { AsideComponent } from './components/aside/aside.component';
import { ModalComponent } from './components/modal/modal.component';


@NgModule({
  declarations: [
    ModalComponent,
    AsideComponent,
    SafePipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ModalComponent,
    AsideComponent,
    SafePipe,
  ]
})
export class SharedModule { }
