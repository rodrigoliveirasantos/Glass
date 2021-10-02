import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, QueryList,  ViewChildren, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { GetAllMessageData, GetAllRequestBody, WebsocketResponse } from 'src/app/shared/interfaces/types';
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
  @Input() selectedYear!: number;
  @Input() selectedMonth!: number;

  @ViewChildren(CalendarCellComponent) cells!: QueryList<CalendarCellComponent>; 

  constructor(private changeDetector: ChangeDetectorRef, private _professionalDataService: ProfessionalDataService, private _modalService: ModalService) {
    // Atua
    this._professionalDataService.on('GET_ALL', this.handleCalendarData, this);
    // Quando uma consulta é feita, atualiza o calendário para os usuários que estão vendo
    this._professionalDataService.on('ADD_APPOINTMENT', (message) => {
        const { appointment } = message.data;
        const appointmentDate = new Date(appointment.appointmentDate);

        if (appointmentDate.getMonth() !== this.selectedMonth) return;    
      
        const cell = this.getCellByDay(appointmentDate.getDate());
        if (cell === -1){
          return alert('Houve um problema em atualizar o calendário. Célula com o dia não foi encontrada');
        }

        // As células que nao tem nenhuma consulta, não recebem o valor do appointment por questões de otimização no algorítmo
        // de preenchimento do calendário.
        // Nesse caso é criado um array.
        cell.appointments ? cell.appointments.push(appointment) : cell.appointments = [ appointment ];
        cell.emitData(); // Emite os novos dados para o menu lateral
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

  private getDaysOfMonth(month: number, year: number = this.today.getFullYear()): number {
    [ month, year ] = this.repairDateOverflow(month, year);

    if (month !== 1) return this.daysOfMonth[month];

    const isLeapYear = ((year % 4 === 0) && (year % 100 === 0) && (year % 400 === 0));
    return isLeapYear ? 29 : 28;
  }

  private repairDateOverflow(month: number, year: number = this.today.getFullYear()){
    // Essa função pode receber valores maiores de 11 e menor que 0
    // Quando month > 11: Pega os meses extras no ano seguinte, ou ainda depois caso o período ultrapasse o ano seguinte;
    // Quando month < 0: Pega os meses extras no ano anterior, ou ainda depois caso o período ultrapasse o ano anterior;

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

      cellValue++
    }

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
    data.schedules.forEach((s: Schedule) => schedules.set(s.dayOfWeek, s));

    this.cells.forEach(cell => {
      const daySchedule = !cell.otherMonth && schedules.has(cell.date.getDay()) ? schedules.get(cell.date.getDay())! : null;
      cell.setSchedule(daySchedule);
    });

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