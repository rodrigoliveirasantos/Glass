import { ChangeDetectorRef, Component, Input, OnInit, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { ActivityListInput, Appointment } from '../../../../../shared/interfaces/types';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit, OnChanges {
  @Input('appointments') appointments!: ActivityListInput;
  appointmentsIterator: [string, Appointment | null][] | undefined;
  date!: Date;
  
  constructor(
    public _modalService: ModalService, 
    private _professionalDataService: ProfessionalDataService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(){
    this.appointmentsIterator = this.appointments.appointments;
    this.date = this.appointments.date;
  }

  // Faz a requisição para cancelar a consulta e fecha o modal de confimação
  onConfirmAppointmentCancel = async (close: Function, appointmentId: number) => {
    this._professionalDataService.deleteAppointment({ appointmentId, token: this._authService.getToken()! }).then(response => {
      close();

      /* TODO - Criar um modal pra erro */
      if (response.success){
        this._modalService.success('A consulta foi cancelada com sucesso!');
      } else {
        this._modalService.error('Houve um erro para cancelar a consulta');
      }
    });
  }

  sendToAppointmentCreationModal = (time: string) => {
    const dateString = this.date.toISOString().slice(0, 10); // Pega somente a parte da data
    const date = new Date(`${dateString}T${time}`);
    this._modalService.open('appointment-creation', { date: date });
  }

  sendToAppointmentCancelModal = (appointment: Appointment) => {
    const [ formatedDate, formatedTime ]  = (new Date(appointment.appointmentDate)).toLocaleString('pt-BR').split(' ');
    const confirmationMessage = `Você deseja cancelar a consulta do dia <b>${formatedDate}</b> e horário <b>${formatedTime.slice(0, -3)}</b>?`;

    this._modalService.confirmation({
      message: confirmationMessage,
      onConfirm: (close: Function) => { 
        this.onConfirmAppointmentCancel(close, appointment.id); 
      }
    });
  };
}
