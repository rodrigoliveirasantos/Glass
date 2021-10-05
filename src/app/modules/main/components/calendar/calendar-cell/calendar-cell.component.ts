import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CellDataService } from 'src/app/services/cell-data.service';
import { Appointment, CellStates, EventualSchedule, EventualStates, Schedule } from '../../../../../shared/interfaces/types';
import Global from 'src/app/shared/global';

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
  // Guarda as consultas do dia. É null caso não seja o dia de trabalho, nem uma data adicional. 
  appointments!: Appointment[] | null; 
  cellStates = CellStates;
  blockState: CellStates | EventualStates = CellStates.IDLE;
  full = false;

  // Indica se está clicado ou não
  active = false;

  constructor(private _cellDataService: CellDataService) { }

  ngOnInit(): void {
    
  }

  @HostListener('click')
  public emitData(){
    if (this.otherMonth) return;
    
    const scheduleData = this.getScheduleData();
    this._cellDataService.emit({ 
      date: this.date, 
      blockState: this.blockState, 
      appointments: scheduleData,
      schedule: this.schedule, 
    });
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

  // Guarda o cronograma na célula. Esse método também é responsável por guardar
  // cronogramas eventuais (bloqueios e dias fora do de trabalho). É aqui que o estado de bloqueio
  // da célula é decidido. 
  public setSchedule(value: Schedule | EventualSchedule | null){
    this.schedule = value as Schedule;
    // Se não tiver cronograma no dia, ele é considerado IDLE
    if (!value){
      if (this.blockState !== CellStates.BLOCKED_BY_HOLIDAY) this.setBlockState(CellStates.IDLE);
      return;
    }  
    
    // Se o objeto de Schedule não possuir eventualState, é considerado uma Schedule normal. 
    // nesse caso, o dia será considerado OPEN (não há nada de especial nele).
    const eventualState = (value as EventualSchedule).eventualState;
    this.setBlockState(eventualState !== undefined ? eventualState : CellStates.OPEN);
  }

  public setAppointments(value: Appointment[] | null){
    this.appointments = value;
  }

  public setBlockState(state: CellStates | EventualStates){
    this.blockState = state;
  }

  public isFull(){
    if (!this.schedule || !this.appointments) return false;

    return this.appointments.length ===  this.getTotalScheduleTime() / Global.getFrequencyInTime(this.schedule.frequency);
  }

  public isBlocked(){
    return this.blockState !== CellStates.OPEN;
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
    
    const timePerAppointment = Global.getFrequencyInTime(schedule.frequency) * 1000;
    const startTime = Date.parse(`${this.date.toISOString().split('T')[0]} ${schedule.startTime}`)
    const timeInterval = this.getTotalScheduleTime();
    const scheduleTimes = new Map<string, Appointment | null>();

    for (let i = 0; i <= (timeInterval / timePerAppointment); i++){ 
      const timeString = (new Date(startTime + timePerAppointment * i)).toLocaleTimeString('pt-BR');
      scheduleTimes.set(timeString, null);
    }
    
    return scheduleTimes;
  }

  private getTotalScheduleTime(){
    if (!this.schedule) return 0;

    const schedule = this.schedule;
    const formattedDate = this.date.toISOString().split('T')[0];

    const startTime = Date.parse(`${formattedDate} ${schedule.startTime}`);
    const endTime = Date.parse(`${formattedDate} ${schedule.endTime}`);
    const timeInterval = endTime - startTime;

    return timeInterval;
  }

}

