import { Component, OnInit } from '@angular/core';
import { CalendarControlService } from 'src/app/services/calendar-control.service';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { ProfessionalControlService } from 'src/app/services/professional-control.service';
import { GetAllMessageData, Professional } from 'src/app/shared/interfaces/types';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {
  selectedYear: number = 0;
  selectedMonth: number = 0;
  selectedMonthName: string = 'Carregando...';
  selectedProfessional!: Professional;

  professionalList: Professional[] = [];
  weekDayList = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  professionalWorkdays = '';
  
  constructor(
    private _professionalDataService: ProfessionalDataService, 
    private _calendarControlService: CalendarControlService,
    private _professionalControlService: ProfessionalControlService,
    private _modalService: ModalService,
  ){  

    this._professionalDataService.on('OPEN', (message) => {
      this.professionalList = message.data.professionals;
      this.selectedProfessional = this.professionalList[0];
    });

    // Isso vai ser trocado quando atualizar a API;
    this._professionalDataService.on('GET_ALL', (message) => {
      const data = message.data as GetAllMessageData;
      
      const professionalWorkdays = data.schedules.reduce((accumulator, schedule, index) => {
        let separator = ', ';

        if (index === data.schedules.length - 2){
          separator = ' e ';
        }

        if (index === data.schedules.length - 1){
          separator = '';
        }

        accumulator += this.weekDayList[schedule.dayOfWeek] + separator;

        return accumulator;
      }, '');

      this.professionalWorkdays = professionalWorkdays;
    });

    this._calendarControlService.subscribeToDateChange(newDate => {
      this.selectedYear = newDate.year;
      this.selectedMonth = newDate.month;
      this.selectedMonthName = newDate.monthName;
    });

    this._professionalControlService.subscribeToSelectedProfessional(this.handleProfessionalSelectionEvent);
  }

  ngOnInit(){
    
  }

  public handleProfessionalSelectionEvent = (newSelectedProfessional: Professional) => {
    this.selectedProfessional = newSelectedProfessional;
  }

  public onClickOnControl(event: MouseEvent){
    this._calendarControlService.displayControl({ x: event.clientX, y: event.clientY });
  }


}
