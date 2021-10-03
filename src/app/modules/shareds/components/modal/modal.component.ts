import { Component, ElementRef, HostListener, Input,  OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>;
  @Input('content-template') content!: TemplateRef<any>;
  @Input('modal-title') title = '';
  @Input('id') id = '';
  active = false;
  state = ModalStates.CLOSED;
  data = {};

  constructor(private _modalService: ModalService) { }

  ngOnInit(): void {
    if (!this.id){
      return console.warn('É necessário que o Modal possua um id.');
    }

    this._modalService.add(this);
  }

  open(data: any = {}){
    this.active = true;
    this.data = data;

    this.state = ModalStates.OPENING;
  }

  close(){
    this.state = ModalStates.CLOSING;
  }

  @HostListener('animationend')
  onOpenAnimationEnds = () => {
    if (this.state !== ModalStates.OPENING) return;

    this.state = ModalStates.OPEN;
  }

  @HostListener('animationend')
  onCloseAnimationEnds = () => {
    if (this.state !== ModalStates.CLOSING) return;

    this.state = ModalStates.CLOSED;
    this.active = false;
  }

  onClickModal = (event: MouseEvent) => {
    event.stopPropagation();
  }

  onClickBackdrop = () => {
    this.close()
  }

}

enum ModalStates {
  CLOSED = 0,
  OPENING = 1,
  OPEN = 2,
  CLOSING = 3
}
