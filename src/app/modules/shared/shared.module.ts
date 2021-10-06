import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/modules/shared/pipes/safe.pipe';
import { MainRoutingModule } from '../main/main-routing.module';
import { AsideComponent } from './components/aside/aside.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { MenuSectionComponent } from './components/menu-section/menu-section.component';
import { ModalComponent } from './components/modal/modal.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';


@NgModule({
  declarations: [
    ModalComponent,
    AsideComponent,
    MenuSectionComponent,
    SafePipe,
    SuccessModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
  exports: [
    ModalComponent,
    AsideComponent,
    MenuSectionComponent,
    SafePipe,
    SuccessModalComponent,
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
