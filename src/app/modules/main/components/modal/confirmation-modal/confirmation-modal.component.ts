import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ConfirmationModalData } from 'src/app/shared/interfaces/types';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit, OnChanges {
  @Input('data') data!: ConfirmationModalData;
  message: string = 'Você deseja realizar a ação?';

  constructor(private _modalService: ModalService) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.message = this.data.message;
  }
  // Passa a função de fechar o modal como argumento para o callback
  // de confirmação. Não é interessante o próprio modal se fechar, porque isso faria
  // com que o modal fechasse antes que operações websocket terminassem de ser executadas.
  confirm = () => {
    this.data.onConfirm(() => this._modalService.close('confirmation'));
  }
}

