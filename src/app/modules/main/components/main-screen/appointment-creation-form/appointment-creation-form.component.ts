import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ProfessionalControlService } from 'src/app/services/professional-control.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { ModalService } from 'src/app/services/modal.service';

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
  onlyLettersRegex = '[a-zA-Zà-úÀ-Ú ]*';
  waitingResponse = false;
  timeoutId = 0;

  controls = {
    roomId: new FormControl('', Validators.required),
    patient: new FormControl('', [Validators.required, Validators.pattern(this.onlyLettersRegex)]),
    appointmentType: new FormControl('', Validators.required)
  }

  form = new FormGroup(this.controls);
  
  constructor(private _profissionalControlService: ProfessionalControlService, private _professionalDataService: ProfessionalDataService, private _modalService: ModalService) {
    this._professionalDataService.on('ADD_APPOINTMENT' , (response) => {
      window.clearTimeout(this.timeoutId);
      this.stopWaiting();

      this._modalService.closeAll();
      this._modalService.success('A criação da consulta foi um sucesso!');
    });

    this._professionalDataService.on('ADD_APPOINTMENT_ERROR', (response) => {
      window.clearTimeout(this.timeoutId);
      this.stopWaiting();
      alert('Houve um erro ao criar a consulta.');

      console.log('Response erro: ', response)
    });
  }

  ngOnInit(): void {
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

    this._professionalDataService.addAppointment({
      roomId: parseInt(formData.roomId),
      patientId: 1,
      professionalId: this.professionalId!,
      appointment: {
        appointmentType: 'Default',
        appointmentDate: this.brazilianDateToJson(this.date),
      }
    });

    this.waitResponse();
    // Cria um timeout para caso uma resposta não seja enviada
    this.timeoutId = window.setTimeout(this.stopWaiting, 12000);
  }

  /** Converte uma data com fuso horário brasileiro para o formato JSON */
  private brazilianDateToJson(date: Date){
    const [dateString, timeString] = date.toLocaleString('pt-BR').split(' ');
    const [day, month, year] = dateString.split('/');

    return `${year}-${month}-${day}T${timeString}`;
  }

  private stopWaiting = () => {
    this.form.enable();
    this.waitingResponse = false;
  }

  private waitResponse = () => {
    this.form.disable();
    this.waitingResponse = true;
  }
}

interface FormData {
  [key: string]: any,
  roomId: string,
  patient: string,
  appointmentType: string
}
