import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { ActivityListComponent } from './components/action-menu/activity-list/activity-list.component';
import { CalendarCellComponent } from './components/calendar/calendar-cell/calendar-cell.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentCreationFormComponent } from './components/main-screen/appointment-creation-form/appointment-creation-form.component';
import { CalendarControlComponent } from './components/main-screen/calendar-control/calendar-control.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { ProfessionalSelectComponent } from './components/main-screen/professional-select/professional-select.component';
import { MainRoutingModule } from './main-routing.module';
import { ProfessionalEventualScheduleFormComponent } from './components/main-screen/professional-eventual-schedule-form/professional-eventual-schedule-form.component';



@NgModule({
  declarations: [
    MainScreenComponent,
    ActionMenuComponent,
    CalendarComponent,
    CalendarCellComponent,
    ActivityListComponent,
    ProfessionalSelectComponent,
    AppointmentCreationFormComponent,
    CalendarControlComponent,
    ProfessionalEventualScheduleFormComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
  ]
})
export class MainModule { }
