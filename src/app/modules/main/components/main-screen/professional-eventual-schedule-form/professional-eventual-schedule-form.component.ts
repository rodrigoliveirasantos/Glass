import { Component, ElementRef, Input, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventualStates, Frequency } from 'src/app/shared/interfaces/types';
import Global from 'src/app/shared/global';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-professional-eventual-schedule-form',
  templateUrl: './professional-eventual-schedule-form.component.html',
  styleUrls: ['./professional-eventual-schedule-form.component.scss']
})
export class ProfessionalEventualScheduleFormComponent implements OnInit {
  @Input('data') data!: Data;

  selectOptions: SelectOptions = []
  controls: { [key: string]: AbstractControl };
  form: FormGroup;

  constructor(
    private _professionalDataService: ProfessionalDataService,
    private _modalService: ModalService,
    private _authService: AuthService
  ) { 
    const frequencyEnumKeys = Object.values(Frequency).filter(f => typeof f === 'number') as Frequency[];
    this.selectOptions = frequencyEnumKeys.map(key => ({ value: key, text: Global.getFrequencyName(key) }));

    this.controls = {
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', [Validators.required, this.timeValidator]),
      frequency: new FormControl('', [Validators.required, this.frequencyValidator]),
    };

    this.form = new FormGroup(this.controls);

    this._professionalDataService.on('ADD_EVENTUAL_SCHEDULE', (message) => {
      const [component, employee] = message.componentId?.split('//')!;
      if (component !== 'eventual-schedule' || parseInt(employee) !== this._authService.getSession().id) return;

      this._modalService.close('eventual-schedule');
      this._modalService.success('O dia foi liberado com sucesso!');

    });

    this._professionalDataService.on('ADD_EVENTUAL_SCHEDULE_ERROR', (message) => {
      this._modalService.error('Houve um erro ao liberar o dia');
    });
  }

  ngOnInit(): void {
    
  }

  timeValidator = (control: AbstractControl) => {
    const startTime = this.convertTimeInputToSeconds(this.controls?.startTime.value);
    const endTime = this.convertTimeInputToSeconds(this.controls?.endTime.value);
    if (startTime >= endTime) return { invalidDate: true }

    return null
  }

  frequencyValidator = (select: AbstractControl) => {
    if (!this.controls?.startTime.value || !this.controls?.endTime.value) return null;

    const startTime = this.convertTimeInputToSeconds(this.controls.startTime.value);
    const endTime = this.convertTimeInputToSeconds(this.controls.endTime.value);

    return endTime - startTime < Global.getFrequencyInTime(select.value) ? { invalidFrequency: true } : null
  }

  onSubmit = () => {
    this._professionalDataService.addEventualSchedule({
      employeeId: this.data.employeeId,
      eventualSchedule: {
        startTime: this.controls.startTime.value + ':00',
        endTime: this.controls.endTime.value + ':00',
        frequency: this.controls.frequency.value,
        eventualState: EventualStates.OPEN,
        eventualDate: Global.brazilianDateToJson(this.data.date),
        id: 53253
      },
      componentId: `eventual-schedule//${this._authService.getSession().id}`,
    });

    console.log({
      employeeId: this.data.employeeId,
      eventualSchedule: {
        startTime: this.controls.startTime.value + ':00',
        endTime: this.controls.endTime.value + ':00',
        frequency: this.controls.frequency.value,
        eventualState: EventualStates.OPEN,
        eventualDate: Global.brazilianDateToJson(this.data.date),
        id: 53253
      },
      componentId: `eventual-schedule//${this._authService.getSession().id}`
    })
  }

  private convertTimeInputToSeconds = (value: string) => {
    if (!value) return 0;

    const [hours, minutes] = value.split(':');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60;
  }

  log(){
    console.log(this.controls.endTime.errors);
  }
}

type SelectOptions = { value: Frequency, text: string }[]

interface Data {
  employeeId: number,
  date: Date
}