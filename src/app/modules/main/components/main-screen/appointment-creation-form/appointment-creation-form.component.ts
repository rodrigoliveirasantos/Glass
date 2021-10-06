import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ProfessionalControlService } from 'src/app/services/professional-control.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { Room } from 'src/app/shared/interfaces/types';
import Global from 'src/app/shared/global';

@Component({
  selector: 'app-appointment-creation-form',
  templateUrl: './appointment-creation-form.component.html',
  styleUrls: ['./appointment-creation-form.component.scss']
})
export class AppointmentCreationFormComponent implements OnInit {
  @Input('data') data = {} as any;
  date = new Date(); // Objeto de data que vai ser enviado para criar consulta
  dateString = ''; // String da data selecionada para marcar usada no template
  professionalName = ''; 
  professionalId: number | null = null;
  waitingResponse = false;
  rooms: Room[] = [];

  controls = {
    roomId: new FormControl('', Validators.required),
    // O regex abaixo serve para permitir apenas letras
    patient: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Zà-úÀ-Ú ]*')]), 
    appointmentType: new FormControl('', [Validators.required, Validators.maxLength(30)]),
  }

  form = new FormGroup(this.controls);
  
  constructor(
    private _profissionalControlService: ProfessionalControlService, 
    private _professionalDataService: ProfessionalDataService, 
    private _modalService: ModalService,
    private _authService: AuthService,
  ) {
    this._professionalDataService.on('GET_ALL_ROOMS', (message) => {
      this.rooms = message.data.rooms;
    });

    this._professionalDataService.on('GET_ALL_ROOMS_ERROR', (message) => {
      this.closeParentModal();
      this._modalService.error('Houve um erro ao pegar ao pegar as salas. Por favor, tente novamente mais tarde. Detalhes: <br/><br/>' + message.error);
    });
  }

  ngOnInit(): void {
    this._professionalDataService.getAllRooms();

    const professional = this._profissionalControlService.getSelectedProfessional();
    this.professionalName = professional?.name || 'Não foi possível';
    this.professionalId = professional?.id;
    this.date = this.data.date;
    this.dateString = `${this.date.toLocaleString('pt-BR').slice(0, -3)}`; // Formata o horário em brasileiro e tira os segundos 
  }

  onSubmit = () => {
    if (this.waitingResponse) return;
    
    const formData = {} as FormData;
    Object.entries(this.controls).forEach(entry => {
      formData[entry[0]] = entry[1].value
    });

    this.waitResponse();
    /* TODO - Atualizar esse body */
    const body = {
      roomId: parseInt(formData.roomId),
      patientId: 1,
      professionalId: this.professionalId!,
      appointment: {
        appointmentType: formData.appointmentType,
        appointmentDate: Global.brazilianDateToJson(this.date),
      },
      token: this._authService.getToken()!,
    }

    this._professionalDataService.addAppointment(body).then((response) => {
      this.stopWaiting();
      
      if (response.success){
        this.closeParentModal();
        this._modalService.success('A consulta foi marcada com sucesso!');
      } else {
        this._modalService.error('Houve um erro ao marcar a consulta');
      }
    });

  }



  private stopWaiting = () => {
    this.form.enable();
    this.waitingResponse = false;
  }

  private waitResponse = () => {
    this.form.disable();
    this.waitingResponse = true;
  }

  private closeParentModal(){
    this._modalService.close('appointment-creation');
  }
}

interface FormData {
  [key: string]: any,
  roomId: string,
  patient: string,
  appointmentType: string
}
