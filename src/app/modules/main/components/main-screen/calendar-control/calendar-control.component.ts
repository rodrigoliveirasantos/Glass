import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalendarControlService, DisplayEvent } from 'src/app/services/calendar-control.service';

@Component({
  selector: 'app-calendar-control',
  templateUrl: './calendar-control.component.html',
  styleUrls: ['./calendar-control.component.scss']
})
export class CalendarControlComponent implements OnInit {
  public selectedYear = 0;
  public selectedMonth = 0;
  public active = false;

  public monthNames: string[];
  @ViewChild('calendarControl') calendarControl!: ElementRef<HTMLDivElement>;

  constructor(private _calendarControlService: CalendarControlService) { 
    this.monthNames = this._calendarControlService.monthNames;

    this._calendarControlService.subscribeToDisplayEvent(position => {
      if (!this.active){
        this.active = true;
        document.addEventListener('click', this.onBlurControl);
      }

      this.positionCalendarControl(position);
    }); 

    // Recolhendo os dados iniciais
    const { year, month } = this._calendarControlService.getEventData();
    this.selectedMonth = month;
    this.selectedYear = year;
  }

  ngOnInit(): void {
    
  }

  public setSelectedMonth(value: number){
    this.selectedMonth = value;
    this._calendarControlService.setSelectedMonth(value);
  }

  public setSelectedYear(value: number){
    this.selectedYear = value;
    this._calendarControlService.setSelectedYear(value);
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
    this.setSelectedYear(this.selectedYear + direction);
  }


  private positionCalendarControl(event: DisplayEvent) {
    const controlElement = this.calendarControl.nativeElement;

    controlElement.style.top = `${event.y + 20}px`;
    controlElement.style.left = `${event.x - 120}px`;
  }

  public onBlurControl = (event: MouseEvent) => {
    const controlElement = this.calendarControl.nativeElement;

    for (let target of event.composedPath()){
      const element = target as HTMLElement;

      if (element.id === controlElement.id || element.id === 'date-menu-icon'){
        return
      }
    }

    this.active = false;
    document.removeEventListener('click', this.onBlurControl);
  }
}



