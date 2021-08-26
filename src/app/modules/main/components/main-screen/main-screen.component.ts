import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit{
  selectedYear: number = 2021;
  selectedMonth: number = 0;
  calendarControlIsOpen: boolean = false;

  readonly monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  @ViewChild('monthGrid') monthGrid!: ElementRef<HTMLDivElement>;
  @ViewChild('calendarControl') calendarControl!: ElementRef<HTMLDivElement>;
  
  
  constructor() {  
    console.log('Main-screen'); 
    
  }

  ngOnInit(): void {
   
  }

  ngOnDestroy(): void {

  }

  public onClickMonthNode(i: number){
    this.selectedMonth = i;
  }

  public formatYearInput(event: Event): void {
    const target = event.currentTarget! as HTMLInputElement;
    let value = target.value.trim();

    if (value.match(/([^\d])/)){
      target.value = String(this.selectedYear);
      return 
    }

    this.selectedYear = parseInt(value);
    target.value = String(this.selectedYear);
  }

  public incrementYear(direction: (1 | -1) = 1 ){
    this.selectedYear += direction;
  }

  public onClickOnControl(event: MouseEvent){
    if (!this.calendarControlIsOpen){
      event.stopPropagation(); // Impede que o evento seja acionado quando o calendar-control aparecer.
      this.toggleCalendarControl(true);
      document.addEventListener('click', this.onBlurControl);
    }

    this.positionCalendarControl(event);
  }

  // Esse método deve ser uma arrow function para manter o this
  public onBlurControl = (event: MouseEvent) => {
    const controlElement = this.calendarControl.nativeElement;

    for (let target of event.composedPath()){
      const element = target as HTMLElement;

      if (element.id === controlElement.id || element.id === 'date-menu-icon'){
        return
      }
    }

    this.toggleCalendarControl(false);
    document.removeEventListener('click', this.onBlurControl);
  }


  private positionCalendarControl(event: MouseEvent){
    const controlElement = this.calendarControl.nativeElement;
    controlElement.style.top = `${event.clientY + 20}px`;
    controlElement.style.left = `${event.clientX - controlElement.clientWidth / 2}px`;
  }

  private toggleCalendarControl(force?: boolean){
    const controlElement = this.calendarControl.nativeElement;
    this.calendarControlIsOpen = force ? force : !this.calendarControlIsOpen;
    controlElement.classList.toggle('active', this.calendarControlIsOpen);
  }

}
