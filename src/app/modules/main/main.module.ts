import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { MainRoutingModule } from './main-routing.module';
import { AsideComponent } from './components/aside/aside.component';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarCellComponent } from './components/calendar/calendar-cell/calendar-cell.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { MenuSectionComponent } from './components/action-menu/menu-section/menu-section.component';

@NgModule({
  declarations: [
    MainScreenComponent,
    AsideComponent,
    ActionMenuComponent,
    CalendarComponent,
    CalendarCellComponent,
    LoadingScreenComponent,
    MenuSectionComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
