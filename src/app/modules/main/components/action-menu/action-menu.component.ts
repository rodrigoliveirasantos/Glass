import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CellDataService } from 'src/app/services/cell-data.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProfessionalControlService } from 'src/app/services/professional-control.service';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { ActivityListInput, CellData, CellDataAppointments, CellStates, EventualStates, Schedule, WebsocketResponse } from 'src/app/shared/interfaces/types';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {
  public blockReason: string = '';
  public userIsAdmin: boolean;
  public CellStates = CellStates; // Isso teve que ser declarado para ser usado no template 

  private date!: Date;
  public dateString!: string;
  public blockState!: CellStates | EventualStates;
  public appointments!: CellDataAppointments;
  public dayIsBlocked!: boolean; 
  public schedule!: Schedule | null;
 
  public activityListInput: ActivityListInput = {
    date: new Date(),
    appointments: []
  } // Dados que serão passados para o filho
  
  constructor(
    private _cellDataService: CellDataService, 
    private _authService: AuthService,
    private _professionalControlService: ProfessionalControlService,
    private _professionalDataService: ProfessionalDataService,
    private _modalService: ModalService,
  ) {
    this.userIsAdmin = this._authService.getSession().isAdmin;
    this._professionalDataService.on('ADD_EVENTUAL_SCHEDULE', (message) => this.handleBlockOrUnlockDayMessage(message, 'O dia foi bloqueado com sucesso!'));
    this._professionalDataService.on('DELETE_EVENTUAL_SCHEDULE', (message) => this.handleBlockOrUnlockDayMessage(message, 'O dia foi desbloqueado com sucesso!'));
  }
  
  ngOnInit(): void {
    this._cellDataService.subscribe(this.handleCellData);  
  }

  /* É chamada quando o usuário desbloqueia ou bloqueia um dia */
  handleBlockOrUnlockDayMessage(wsMessage: WebsocketResponse, successMessage: string) {
    if (!wsMessage.componentId || Number(wsMessage.componentId) !== this._authService.getSession().id) return;
      
    this._modalService.success(successMessage);
  }

  sendToBlockDayModal(){
    if (this.dayIsBlocked) return;

    this._modalService.confirmation({
      message: `Você tem certeza que deseja bloquear o dia: <b>${this.dateString}</b>? Essa ação irá desmarcar todas as consultas no dia.`,
      onConfirm: (close) => {
        this._professionalDataService.blockDay({
          employeeId: this._professionalControlService.getSelectedProfessional().id,
          eventualSchedule: {
            endTime: this.schedule!.endTime,
            startTime: this.schedule!.startTime,
            frequency: this.schedule!.frequency,
            eventualDate: this.date.toJSON().split('T')[0]
          },
          componentId: this._authService.getSession().id,
        })

        close();
      }
    });

  }

  blockDayForEveryone(){
    if (!this.userIsAdmin) return;

  }

  sendToUnlockDayModal(){
    if (!this.dayIsBlocked) return;

    if (this.blockState === CellStates.IDLE || this.blockState === CellStates.BLOCKED_BY_HOLIDAY){
      this._modalService.open('eventual-schedule', { employeeId: this._professionalControlService.getSelectedProfessional().id, date: this.date })
    } else {
      this._modalService.confirmation({
        message: `Você tem certeza que deseja <b>desbloquear</b> o dia: <b>${this.dateString}</b>? Administradores e profissionais poderão marcar consulta nesse dia.`,
        onConfirm: (close) => {
          this._professionalDataService.deleteEventualSchedule({
            employeeId: this._professionalControlService.getSelectedProfessional().id,
            eventualScheduleId: this.schedule!.id,
            componentId: this._authService.getSession().id,
          });
  
          close(); 
        }
      });
    }
  }

  // Pega a mensagem sobre o status de bloqueio do dia. A mensagem de bloqueio
  // tem um alteração dependendo se o usuário é um administrador ou não. Isso funciona porque
  // o professional só pode ver dias bloqueados por si mesmo ou pelo profissional.
  private getMessageByBlockState(state: CellStates | EventualStates){
    switch(state){
      case CellStates.BLOCKED_BY_ADMIN:
        return 'Esse dia foi bloqueado por um administrador';
      
      case CellStates.BLOCKED_BY_HOLIDAY:
        return 'Esse dia foi bloqueado por um feriado';

      case CellStates.BLOCKED_BY_PROFESSIONAL:
        return `Esse dia foi bloqueado ${this.userIsAdmin ? 'pelo profissional' : 'por você'}`;
      
      case CellStates.IDLE:
        return `Esse dia não está ${this.userIsAdmin ? 'no cronograma do profissional ' : 'no seu cronograma'}`
    }

    return '';
  }

  /* TODO - Tornar isso aqui mais limpo */
  private handleCellData = (cellData: CellData) => {
    const { appointments, date } = cellData;

    this.date = date;
    this.dateString = date.toLocaleDateString('pt-BR');
    this.appointments = appointments;
    this.blockReason = this.getMessageByBlockState(cellData.blockState);
    this.dayIsBlocked =  cellData.blockState !== CellStates.OPEN 
     
    this.blockState = cellData.blockState;
    this.schedule = cellData.schedule;

    const appointmentsEntries = appointments ? Array.from(appointments.entries()) : undefined;

    this.activityListInput = {
      date: date,
      appointments: appointmentsEntries
    }
  }
}

