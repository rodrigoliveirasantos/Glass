import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ProfessionalControlService } from 'src/app/services/professional-control.service';
import { Professional } from 'src/app/shared/interfaces/types';


@Component({
  selector: 'app-professional-select',
  templateUrl: './professional-select.component.html',
  styleUrls: ['./professional-select.component.scss']
})
export class ProfessionalSelectComponent implements OnInit, OnChanges {
  professionalList: Professional[] = [];
  selectedProfessional!: Professional;
  active = false;

  @ViewChild('optionList') optionListRef!: ElementRef<HTMLUListElement>;

  constructor(private _professionalControlService: ProfessionalControlService) {
    this._professionalControlService.subscribeToProfessionalList((list) => {
      this.professionalList = list;
      this.selectedProfessional = list[0];
    });
  }

  ngOnInit(): void {
    document.addEventListener('click', this.onBlur);
  }

  ngOnChanges(): void {
    this.selectedProfessional = this.professionalList[0];
  }

  public toggleActive(force?: boolean){
      this.active = (typeof force) === 'boolean' ? force! : !this.active;
  }

  public emitSelectedProfessional($event: Professional){
    if (!Object.is(this.selectedProfessional, $event)){
      this._professionalControlService.setSelectedProfessional($event);
      this.toggleActive(false);
    }
  }

  public onClickSelect = (event: MouseEvent) => {
    this.toggleActive();
    event.stopPropagation();
  }

  public onBlur = (event: MouseEvent) => {
    if (!this.active) return;
    
    let shouldClose = true;

    for (let target of event.composedPath().slice(2)){
      const element = target as HTMLElement;

      if (element === this.optionListRef.nativeElement) {
        shouldClose = false;
        break;
      }
    }
    
    this.active = !shouldClose;
  }

}
