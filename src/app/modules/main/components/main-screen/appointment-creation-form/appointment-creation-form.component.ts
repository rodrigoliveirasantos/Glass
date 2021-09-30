import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ProfessionalControlService } from 'src/app/services/professional-control.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';

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

  controls = {
    roomId: new FormControl('', Validators.required),
    patient: new FormControl('', [Validators.required, Validators.pattern(this.onlyLettersRegex)]),
    appointmentType: new FormControl('', Validators.required)
  }

  form = new FormGroup(this.controls);
  
  constructor(private _profissionalControlService: ProfessionalControlService, private _professionalDataService: ProfessionalDataService) {
    this._professionalDataService.on('ADD_APPOINTMENT' , () => {
      this.form.enable();
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
    const formData = {} as FormData;
    Object.entries(this.controls).forEach(entry => {
      formData[entry[0]] = entry[1].value
    });

    this._professionalDataService.addAppointment({
      roomId: parseInt(formData.roomId),
      patientId: 1,
      professionalId: this.professionalId!,
      appointment: {
        appointmentType: 0,
        appointmentDate: this.data.appointmentDate,
      }
    });

    this.form.disable();
  }
}

interface FormData {
  [key: string]: any,
  roomId: string,
  patient: string,
  appointmentType: string
}
