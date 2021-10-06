import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminCardPeopleComponent } from './components/cards/admin-card-people/admin-card-people.component';
import { AdminCardRoomComponent } from './components/cards/admin-card-room/admin-card-room.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { SectionMenuComponent } from './components/section-menu/section-menu.component';
import { RoomCreationFormComponent } from './components/room-creation-form/room-creation-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MainScreenComponent,
    SectionMenuComponent,
    AdminCardRoomComponent,
    AdminCardPeopleComponent,
    RoomCreationFormComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule, 
  ],
})
export class AdminModule { }
