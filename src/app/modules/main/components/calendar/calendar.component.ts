import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, QueryList,  ViewChildren } from '@angular/core';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { GetAllMessageBody, WebsocketResponse } from 'src/app/shared/interfaces/types';
import { CalendarCellComponent } from './calendar-cell/calendar-cell.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit, OnChanges {
  readonly today = new Date(Date.now());
  readonly abreviations = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  readonly daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  @Input() selectedYear!: number;
  @Input() selectedMonth!: number;


  @ViewChildren(CalendarCellComponent) cells!: QueryList<CalendarCellComponent>; 

  constructor(private changeDetector: ChangeDetectorRef, private _professionalDataService: ProfessionalDataService) {
    this._professionalDataService.on('GET_ALL', this.handleCalendarData, this);
  }

  ngAfterViewInit(): void {
    this.loadCalendarFromMonth(this.selectedMonth, this.selectedYear);
    // Força uma detecção de mudanças para o Angular captar todas as mudanças no CalendarCell causadas pelo
    // script do calendário.
    this.changeDetector.detectChanges();
  }

  ngOnChanges(): void {
    if (this.cells) this.loadCalendarFromMonth(this.selectedMonth, this.selectedYear);
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
    if (firstWeekDayOfMonth > 0 && --cellMonth < 0){ year-- };

    let monthMaxDays = this.getDaysOfMonth(cellMonth);
    let cellValue = firstWeekDayOfMonth > 0 ? monthMaxDays - (firstWeekDayOfMonth - 1) : 1;
    
    for (let cell of this.cells){
      if (cellValue > monthMaxDays){
        if (++cellMonth > 11){ year++ }

        monthMaxDays = this.getDaysOfMonth(cellMonth, year);
        cellValue = 1;
      }

      cell.day = cellValue;
      cell.date = new Date(`${year}-${cellMonth + 1 === 0 ? 12 : cellMonth + 1 }-${cellValue} 00:00:00`);
      cell.otherMonth = cellMonth !== month;

      cellValue++
    }

    const body: GetAllMessageBody = {
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
    const daysOfWeek = message.data!.schedules.map((s: any) => s.dayOfWeek);
    console.log(message)
    this.cells.forEach(cell => {
        cell.state = !cell.otherMonth && daysOfWeek.includes(cell.date.getDay()) ? 1 : 0;
    });
  }

}