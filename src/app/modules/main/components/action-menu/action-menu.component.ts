import { Component, OnInit } from '@angular/core';
import { CellDataService } from 'src/app/services/cell-data.service';
import { ActivityListInput, Appointment, CellData, CellDataAppointments } from 'src/app/shared/interfaces/types';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {
  public dateString!: string;
  public appointments!: CellDataAppointments;
 
  public activityListInput: ActivityListInput = {
    date: new Date(),
    appointments: []
  } // Dados que serão passados para o filho
  
  constructor(private _cellDataService: CellDataService) {
  }
  
  ngOnInit(): void {
    this._cellDataService.subscribe(this.handleCellData);  
  }

  private handleCellData = (cellData: CellData) => {
    const { appointments, date } = cellData;

    this.dateString = date.toLocaleDateString('pt-BR');
    this.appointments = appointments;
    const appointmentsEntries = appointments ? Array.from(appointments.entries()) : undefined;

    this.activityListInput = {
      date: date,
      appointments: appointmentsEntries
    }
  }
}

