import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, QueryList,  ViewChildren, OnInit } from '@angular/core';
import { HolidayService } from 'src/app/services/holiday.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProfessionalControlService } from 'src/app/services/professional-control.service';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { CellStates, EventualSchedule,  GetAllMessageData, GetAllRequestBody, WebsocketResponse } from 'src/app/shared/interfaces/types';
import { Schedule, Appointment } from '../../../../shared/interfaces/types';
import { CalendarCellComponent } from './calendar-cell/calendar-cell.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit, OnChanges, OnInit {
  readonly today = new Date(Date.now());
  readonly abreviations = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  readonly daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  readonly rows = Array(6);
  readonly cols = Array(7);

  private currentActiveCell: CalendarCellComponent | undefined;
  private holidays = {}
  @Input() selectedYear!: number;
  @Input() selectedMonth!: number;

  @ViewChildren(CalendarCellComponent) cells!: QueryList<CalendarCellComponent>; 

  constructor(
    private changeDetector: ChangeDetectorRef, 
    private _professionalDataService: ProfessionalDataService, 
    private _professionalControlService: ProfessionalControlService,
    private _modalService: ModalService,
    private _holidayService: HolidayService
  ) {

    this._professionalDataService.on('GET_ALL', async (message, listener) => this.handleCalendarData(message, listener));
    // Quando as seguintes mensagens são recebidas, elas atualizam o calendário
    this._professionalDataService.on('ADD_APPOINTMENT', (message) => this.beforeUpdate(message, (cell) => {
        cell.appointments ?  cell.appointments.push(message.data.appointment) : cell.setAppointments([ message.data.appointment ]);
    }));

    this._professionalDataService.on('DELETE_APPOINTMENT', (message) => this.beforeUpdate(message, (cell) => {
      cell.appointments = cell.appointments!.filter(a => a.id !== message.data.appointment.id);
    }));

    this._professionalDataService.on('ADD_EVENTUAL_SCHEDULE', (message) => this.beforeUpdate(message, (cell, date) => { 
      if (date.getMonth() !== this.selectedMonth) return;
      cell.setSchedule(message.data.eventualSchedule);

      const eventualState = message.data.eventualSchedule.eventualState;
      if (eventualState === CellStates.BLOCKED_BY_ADMIN || eventualState === CellStates.BLOCKED_BY_PROFESSIONAL){
        cell.setAppointments([]);
      }
    }));
    // Ao deletar um cronograma eventual, o handler envia uma mensagem para o handler do GET_SCHEDULES terminar de atualizar
    // a célula
    this._professionalDataService.on('DELETE_EVENTUAL_SCHEDULE', (message) => this.beforeUpdate(message, (cell, date) => {
      const selectedProfessionalId = this._professionalControlService.getSelectedProfessional().id;
      const professionalInMessageId =  message.data.eventualSchedule.employee.id;
      if (date.getMonth() !== this.selectedMonth || selectedProfessionalId !== professionalInMessageId) return;

      // Passa o dia pelo componentId para pegar no handler do GET_SCHEDULES
      this._professionalDataService.getSchedules({ 
        employeeId: professionalInMessageId,
        componentId: cell.day, 
      });

      return false;
    }));

    this._professionalDataService.on('GET_SCHEDULES', (message) => {
      const cellDay = parseInt(message.componentId!);
      const cell = this.getCellByDay(cellDay) as CalendarCellComponent;
      const schedule = message.data.schedules.find((s: Schedule) => {
        return cell.date.getDay() === s.dayOfWeek;
      });

      cell.setSchedule(schedule || null);
      cell.emitData();
    });

    this._professionalDataService.on('GET_SCHEDULES_ERROR', (message) => {
      this._modalService.error('Houve um erro para pegar os cronogramas do profissional.');
    });
  }  

  ngAfterViewInit(): void {
    this.loadCalendarFromMonth(this.selectedMonth, this.selectedYear);
    // Força uma detecção de mudanças para o Angular captar todas as mudanças no CalendarCell causadas pelo
    // script do calendário.
    this.changeDetector.detectChanges();
  }

  ngOnChanges(): void {
    if (this.cells) { 
      this.loadCalendarFromMonth(this.selectedMonth, this.selectedYear);
      this.currentActiveCell?.setActive(false);
      this.currentActiveCell = undefined;
    };
  }

  ngOnInit(){
    
  }

  // Reseponsável por executar um callback quando uma operação é feita no calendário.
  // Esse callback recebe a célula com a data que o evento ocorreu e um objeto de date obtido da mensagem websocket.
  // Quando um callback retorna um booleano, significa que a atualização não deverá ocorrer na execução daquele callback. Dessa forma
  // é possível fazer uma operação assíncrona.
  // Caso o callback não retorne false e algum usuário esteja selecionando a célula que foi atualizada, essa função irá emitir
  // os novos dados para o action-menu.
  private beforeUpdate = (message: WebsocketResponse, cb: (cell: CalendarCellComponent, date: Date) => void | boolean) => {
    const data = message.data;
    const dateString = data.eventualSchedule?.eventualDate || data.appointment?.appointmentDate;
    const date = new Date(dateString);

    if (date.getMonth() !== this.selectedMonth) return;    
  
    const cell = this.getCellByDay(date.getDate());
    if (cell === -1){
      return alert('Houve um problema em atualizar o calendário. Célula com o dia não foi encontrada');
    }

    let shouldEmit = cb(cell, date);
    shouldEmit = typeof shouldEmit === 'boolean' ? shouldEmit : true;
    
    // Emite os novos dados para o menu lateral caso a célula do dia
    // estiver selecionada. Isso impede que outros usuários conectados na mesma tela recebam essa atualização
    // indevidamente.
    if (shouldEmit && cell === this.currentActiveCell) cell.emitData(); 
  }

  private getDaysOfMonth(month: number, year: number = this.today.getFullYear()): number {
    [ month, year ] = this.repairDateOverflow(month, year);

    if (month !== 1) return this.daysOfMonth[month];

    const isLeapYear = ((year % 4 === 0) && (year % 100 === 0) && (year % 400 === 0));
    return isLeapYear ? 29 : 28;
  }

  private repairDateOverflow(month: number, year: number = this.today.getFullYear()){
    // Essa função pode receber valores maiores de 11 e menor que 0
    // Quando month > 11: Pega os meses extras no ano seguinte, ou ainda depois caso o período ultrapasse o ano seguinte;
    // Quando month < 0: Pega os meses extras no ano anterior, ou ainda antes caso o período ultrapasse o ano anterior;

    if (month > 11){
      const extraMonths = month % 11;
      const extraYears = Math.floor(month / 11);

      month = extraMonths;
      year += extraYears;

    } else if (month < 0) {
      const extraMonths = month % 11;
      const extraYears = Math.ceil(month / 11) - 1;
      
      month = 12 + extraMonths;
      year += extraYears;
    }

    return [month, year]
  }

  // Adiciona os valores de dia nas células do calendário. Quando o primeiro dia do mês cai em um dia
  // diferente de domingo, o preenchimento começa do mês anterior. 
  private loadCalendarFromMonth(month: number, year: number = this.today.getFullYear()): void {
    // Cria uma data no dia e mes escolhido. É necessário especificar o horário porque 
    // de algum jeito, o javascript pode mudar a data. Fonte: aconteceu
    const dateString = `${year}-${month + 1}-01 00:00:00`; 
    const firstWeekDayOfMonth = (new Date(dateString)).getDay();
    let cellMonth = month;
    
    // Reduz o ano em 1 quando o mês anterior ao escolhido for o primeiro do ano.
    if (firstWeekDayOfMonth > 0 && --cellMonth < 0){ year--; cellMonth = 11; };

    let monthMaxDays = this.getDaysOfMonth(cellMonth, year);
    let cellValue = firstWeekDayOfMonth > 0 ? monthMaxDays - (firstWeekDayOfMonth - 1) : 1;
    
    for (let cell of this.cells){
      if (cellValue > monthMaxDays){

        if (++cellMonth > 11){ year++; cellMonth = 0; }
        monthMaxDays = this.getDaysOfMonth(cellMonth, year);
        cellValue = 1;
      }

      cell.day = cellValue;
      cell.date = new Date(`${year}-${cellMonth + 1 === 0 ? 12 : cellMonth + 1 }-${cellValue} 00:00:00`);
      cell.otherMonth = cellMonth !== month;
      cell.setBlockState(CellStates.IDLE);

      cellValue++
    }

    this._holidayService.getHolidays(this.selectedYear, this.selectedMonth).then((response) => {
      const { requestedMonth, requestedYear, holidays } = response;

      if (requestedMonth !== this.selectedMonth || requestedYear !== this.selectedYear) return 
        
      holidays.forEach(holiday => {
        const day = parseInt(holiday.date.split('/')[0]);
        const cell = this.getCellByDay(day) as CalendarCellComponent;
        cell.setBlockState(CellStates.BLOCKED_BY_HOLIDAY);
      });
    });

    const body: GetAllRequestBody = {
      employeeId: 3,
      month: this.selectedMonth + 1,
      year: this.selectedYear
    }

    this._professionalDataService.getAll(body);
  }

  
  private getCellByDay(dayNumber: number): CalendarCellComponent | -1 {
    if (dayNumber > this.getDaysOfMonth(this.selectedMonth) || dayNumber < 1){
      console.warn('Numero da célula deve estar entre 1 e o número de dias do mês selecionado');
      return -1; 
    }

    const firstCellIndex = (new Date(`${this.selectedYear}-${this.selectedMonth + 1}-01 00:00:00`)).getDay();
    return this.cells.get(firstCellIndex + dayNumber - 1)!;
  }

  private handleCalendarData(message: WebsocketResponse, listener: ProfessionalDataService){
    const schedules = new Map<number, Schedule>();
    const data = message.data! as GetAllMessageData;
    // Armazena o cronograma em um Map para facilitar a coleta desses dados depois
    data.schedules.forEach((s: Schedule) => schedules.set(s.dayOfWeek, s));

    // Se for um dia de trabalho, a célula irá receber a schedule
    // e um array vazio para as consultas, que será preenchido em frente.
    this.cells.forEach(cell => {
      const isWorkDay = !cell.otherMonth && schedules.has(cell.date.getDay());
      if (isWorkDay && cell.blockState !== CellStates.BLOCKED_BY_HOLIDAY) {
        cell.setAppointments([]);
        cell.setSchedule(schedules.get(cell.date.getDay())!);
      } else {
        cell.setSchedule(null);
      }
    });

    // Adiciona os cronogramas eventuais caso não seja do tipo bloqueio
    // Quando for do tipo bloqueio, adiciona o estado de bloqueio
    data.eventualSchedules.forEach((s: EventualSchedule) => {
      const eventualScheduleDate = new Date(s.eventualDate);
      const cell = this.getCellByDay(eventualScheduleDate.getDate());
      if (cell === -1) return console.warn('Não foi possível adicionar os cronogramas eventuais, célula não encontrada');

      // Adiciona o dayOfWeek para ficar compatível com uma Schedule normal. ~
      cell.setSchedule({ ...s, dayOfWeek: eventualScheduleDate.getDay() });
    })

    // Armazenando todos as consultas do mesmo dia em um array e guardado no HashMap
    const appointmentsByDay = new Map<number, Appointment[]>();
    data.appointments.forEach(appointment => {
      const appointmentDate = (new Date(appointment.appointmentDate)).getDate();

      if (!appointmentsByDay.has(appointmentDate)){
        appointmentsByDay.set(appointmentDate,[ appointment ]);
      } else {
        appointmentsByDay.get(appointmentDate)!.push(appointment);
      }
    });

    // Adiciona as consultas nas células correpondentes 
    appointmentsByDay.forEach((appointments, date) => {
      const cell = this.getCellByDay(date);
      if (cell === -1) {
        return console.warn(`Célula do calendário com a data: ${date} não foi achada.`);
      }

      cell.setAppointments(appointments);
    });
  }

  public handleClickInCell(activeCell: CalendarCellComponent){    
    this.currentActiveCell?.setActive(false);
    this.currentActiveCell = activeCell;
    activeCell.setActive(true);
  }

}


