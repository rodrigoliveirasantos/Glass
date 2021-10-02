import { ChangeDetectorRef, Component, Input, OnInit, OnChanges } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
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
  
  constructor(private _changeDetectorRef: ChangeDetectorRef, public _modalService: ModalService) { }

  ngOnInit(): void {
      
  }

  ngOnChanges(){
    this.appointmentsIterator = this.appointments.appointments;
    this.date = this.appointments.date;
  }

  sendToModal = (time: string) => {
    const dateString = this.date.toISOString().slice(0, 10); // Pega somente a parte da data
    const date = new Date(`${dateString}T${time}`);
    this._modalService.open('appointment-creation', { date: date });
  }
}
