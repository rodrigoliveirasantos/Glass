import { Injectable, OnDestroy } from '@angular/core';
import { ConfirmationModalData } from 'src/app/shared/interfaces/types';
import { ModalComponent } from '../modules/shared/components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: Modals = {}

  constructor() {

  }

  private exists(id: string){
    return Boolean(this.modals[id]);
  }

  public add(modal: ModalComponent){
    if (this.exists(modal.id)){
      return console.warn(`Modal com id '${modal.id}' duplicado.`);
    }

    this.modals[modal.id] = modal;
  }

  public remove(id: string){
    const filteredModals: Modals = {};

    for (let [key, modal] of Object.entries(this.modals)){
      if (key !== id) filteredModals[key] = modal;
    }

    this.modals = filteredModals;
  }

  public open(id: string, data?: any){
    const modal = this.modals[id];
    if (!modal){
      throw Error(`Erro ao abrir modal com id: '${id}' pois não existe.`);
    }

    modal.open(data);
  }

  public close(id: string){
    const modal = this.modals[id];
    if (!modal){
      throw Error(`Erro ao fechar modal com id: '${id}' pois não existe.`);
    }

    modal.close();
  }

  public closeAll(){
    Object.values(this.modals).forEach(modal => modal.close());
  }

  public removeAll(){
    this.closeAll();
    this.modals = {};
  }


  /* Métodos para abrir modais específicos */

  /* Abre o modal de sucesso da operação com uma mensagem */
  public success(message: string = ''){
    this.open('operation-success', { message });
  }

  /* Abre o modal de sucesso da operação com uma mensagem */
  public error(message: string = ''){
    this.open('operation-success', { message, modalTitle: 'Erro!', success: false });
  }

  /* Abre o modal de confirmação de ação. Recebe um método para rodar quando a ação for confirmada */
  public confirmation(data: ConfirmationModalData){
    this.open('confirmation', data);
  }
}

interface Modals {
  [key: string]: ModalComponent
}
