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
import { ActivityListComponent } from './components/action-menu/activity-list/activity-list.component';
import { ProfessionalSelectComponent } from './components/main-screen/professional-select/professional-select.component';
import { AppointmentCreationFormComponent } from './components/main-screen/appointment-creation-form/appointment-creation-form.component';
import { ModalComponent } from './components/modal/modal.component';
import { CalendarControlComponent } from './components/main-screen/calendar-control/calendar-control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SuccessModalComponent } from './components/modal/success-modal/success-modal.component';
import { ConfirmationModalComponent } from './components/modal/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    MainScreenComponent,
    AsideComponent,
    ActionMenuComponent,
    CalendarComponent,
    CalendarCellComponent,
    LoadingScreenComponent,
    MenuSectionComponent,
    ActivityListComponent,
    ProfessionalSelectComponent,
    AppointmentCreationFormComponent,
    ModalComponent,
    CalendarControlComponent,
    SuccessModalComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
  ]
})
export class MainModule { }
