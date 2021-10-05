import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminCardPeopleComponent } from './components/cards/admin-card-people/admin-card-people.component';
import { AdminCardRoomComponent } from './components/cards/admin-card-room/admin-card-room.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { SectionMenuComponent } from './components/section-menu/section-menu.component';



@NgModule({
  declarations: [
    MainScreenComponent,
    SectionMenuComponent,
    AdminCardRoomComponent,
    AdminCardPeopleComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
})
export class AdminModule { }
