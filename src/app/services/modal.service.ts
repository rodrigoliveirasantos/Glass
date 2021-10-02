import { Injectable } from '@angular/core';
import { ModalComponent } from '../modules/main/components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: Modals = {}

  constructor() { 
    console.log(this.modals);
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
    if (id === 'operation-success') return;

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

  public success(message: string = ''){
    this.modals['operation-success'].open({ message });
  }
}

interface Modals {
  [key: string]: ModalComponent
}