import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarControlService {
  private selectedYear: number = 2021;
  private selectedMonth: number = 0;
  private dateChangeEmitter = new Subject<SelectedDateEvent>();
  private displayEventEmitter = new Subject<DisplayEvent>();

  readonly monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  constructor() { 
    
  }

  public subscribeToDateChange(observer: SelectedDateEventObserver){
    this.dateChangeEmitter.subscribe(observer);
    observer(this.getEventData());
  }

  public subscribeToDisplayEvent(observer: DisplayEventObserver){
    this.displayEventEmitter.subscribe(observer);
  }

  // Antecipando o uso disso. Pode ser apagado qualquer coisa.
  public getSelectedYear(){
    return this.selectedYear;
  }

  public getSelectedMonth(){
    return this.selectedMonth;
  }

  public getEventData(): SelectedDateEvent{
    return { year: this.selectedYear, month: this.selectedMonth, monthName: this.monthNames[this.selectedMonth] }
  }

  public setSelectedYear(value: number){
    this.selectedYear = value;
    this.dateChangeEmitter.next(this.getEventData());
  }

  public setSelectedMonth(value: number){
    this.selectedMonth = value;
    this.dateChangeEmitter.next(this.getEventData());
  }

  public displayControl(event: DisplayEvent){
    this.displayEventEmitter.next(event);
  }
}

interface SelectedDateEvent {
  year: number,
  month: number,
  monthName: string,
}

export interface DisplayEvent {
  x: number,
  y: number,
}

type SelectedDateEventObserver = (event: SelectedDateEvent) => void;
type DisplayEventObserver = (event: DisplayEvent) => void;
