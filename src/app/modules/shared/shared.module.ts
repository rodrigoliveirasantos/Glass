import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/modules/shared/pipes/safe.pipe';
import { MainRoutingModule } from '../main/main-routing.module';
import { AsideComponent } from './components/aside/aside.component';
import { MenuSectionComponent } from './components/menu-section/menu-section.component';
import { ModalComponent } from './components/modal/modal.component';


@NgModule({
  declarations: [
    ModalComponent,
    AsideComponent,
    MenuSectionComponent,
    SafePipe,
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
  ]
})
export class SharedModule { }
