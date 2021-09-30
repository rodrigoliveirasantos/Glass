import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CellDataService } from 'src/app/services/cell-data.service';
import { Appointment, Schedule } from '../../../../../shared/interfaces/types';


@Component({
  selector: 'app-calendar-cell',
  templateUrl: './calendar-cell.component.html',
  styleUrls: ['./calendar-cell.component.scss'],
})
export class CalendarCellComponent implements OnInit {
  otherMonth: boolean = false;
  day: number = 0;
  date!: Date;
  schedule!: Schedule | null;
  appointments!: Appointment[] | null;
  full = false;

  active = false;

  constructor(private _cellDataService: CellDataService) { }

  ngOnInit(): void {
  }

  @HostListener('click')
  public onClick(){
    const scheduleData = this.getScheduleData();
    if (!this.otherMonth) this._cellDataService.emit({ date: this.date, appointments: scheduleData });
  }

  @Output() focusEvent = new EventEmitter<CalendarCellComponent>();
  public emitFocusEvent = () =>{
    if (!this.otherMonth) this.focusEvent.emit(this);
  }

  // Esses setters não são realmente necessários, apenas foram criados 
  // para tornar mais fácil de identificar que há uma mudança no estado.
  public setActive(value: boolean){
    this.active = value;
  }

  public setSchedule(value: Schedule | null){
    this.schedule = value;
  }

  public setAppointments(value: Appointment[] | null){
    this.appointments = value;
  }

  public isFull(){
    if (!this.schedule || !this.appointments) return false;
    return this.appointments.length === this.schedule.frequency;
  }

  private getScheduleData(){
    const scheduleMap = this.createScheduleMap();
    if (!scheduleMap) return null;

    this.appointments?.forEach(appointment => {
      const key = appointment.appointmentDate.split('T')[1];
      if (scheduleMap.has(key)) scheduleMap.set(key, appointment);
    });

    return scheduleMap;
  }

  private createScheduleMap() {
    if (!this.schedule) return false;

    const schedule = this.schedule;
    const formattedDate = this.date.toISOString().split('T')[0];

    const startTime = Date.parse(`${formattedDate} ${schedule.startTime}`);
    const endTime = Date.parse(`${formattedDate} ${schedule.endTime}`);
    const frequency = schedule.frequency - 1;

    const timeInterval = endTime - startTime;
    const timePerAppointment = timeInterval / frequency;
    
    const scheduleTimes = new Map<string, Appointment | null>();

    for (let i = 0; i <= frequency; i++){ 
      const timeString = (new Date(startTime.valueOf() + timePerAppointment * i)).toLocaleTimeString('pt-BR');
      scheduleTimes.set(timeString, null);
    }
    
    return scheduleTimes;
  }

}

interface ScheduleData {
  date: Date,
  appointments: Map<string, Appointment>
}
