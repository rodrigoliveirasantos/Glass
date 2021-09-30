import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Professional } from '../shared/interfaces/types';
import { ProfessionalDataService } from './professional-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalControlService {
  private professionalList: Professional[] = [];
  private selectedProfessional!: Professional;
  private professionalSubject = new Subject<Professional>();
  private professionalListSubject = new Subject<Professional[]>();

  constructor(private _professionalDataService: ProfessionalDataService) {
    this._professionalDataService.on('OPEN', (message) => {
      this.setProfessionalList(message.data.professionals);
      this.setSelectedProfessional(this.professionalList[0]);
    });
  }

  public setSelectedProfessional(professional: Professional){
    this.selectedProfessional = professional;
    this.professionalSubject.next(professional);
  }

  public setProfessionalList(list: Professional[]){
    this.professionalList = list;
    this.professionalListSubject.next(list);

    this.professionalListSubject.complete();
  }

  public subscribeToSelectedProfessional(listener: SelectedProfessionalObserver){
    this.professionalSubject.subscribe(listener);
  }

  public subscribeToProfessionalList(listener: ProfessionalListObserver){
    this.professionalListSubject.subscribe(listener);
  }

  public getSelectedProfessional(){
    return this.selectedProfessional;
  }
} 

type SelectedProfessionalObserver = (newValue: Professional) => void
type ProfessionalListObserver = (newValue: Professional[]) => void
