import { Injectable } from '@angular/core';
import { WebsocketResponse, WebsocketMessageHandler, GetAllMessageBody } from '../shared/interfaces/types';
import { WSService } from './ws.service';



// Serviço responsável por fazer a conversa com o Websocket Server sobre os dados dos profissionais.
@Injectable({
  providedIn: 'root'
})
export class ProfessionalDataService {
  private ws!: WebSocket;

  // Guarda os handlers registrados para os eventos.
  private methods: ProfessionalDataServiceMethod = {
    GET_ALL: [],
    OPEN: [],
  };

  // Guarda todas as requisições que foram feitas enquanto o Websocket se conectava.
  private requestQueue: RequestedMethod[] = [];

  constructor(private _WSService: WSService) { 
    // Se conecta com o Websocket e faz todas as requisições agendadas.
    this._WSService.wsObserver.subscribe((ws: WebSocket) => {
      this.ws = ws;

      this.ws.addEventListener('message', ({ data }) => {
        data = JSON.parse(data);
        this.sendToHandlers(data.method, data);
      });

      this.requestQueue.forEach(requestedMethod => {
        this.send(requestedMethod.name, requestedMethod.message);
      });
    })
    
  }

  // Passa a mensagem a todos os handlers aplicando o contexto indicado.
  public sendToHandlers(methodName: string, data: WebsocketResponse): void {
    const methodHandlers = this.getMethodHandlers(methodName);
    methodHandlers.forEach(({ handler, context }) => {  
      context ?  handler.apply(context, [ data, this ]) : handler(data, this);
    });
  }

  // Adiciona um handler para um tipo de mensagem especifico.
  public on(methodName: string, handler: WebsocketMessageHandler, context?: ThisType<any>): boolean {
    const method = this.getMethodHandlers(methodName);
    method.push({ handler, context });

    return this._WSService.ready;
  }

  public unsubscribe(methodName: string, handler: WebsocketMessageHandler){
    const method = this.methods[methodName];
    if (!method) {
      console.warn(`Método: ${methodName} não existe.`);
    }
    
    this.methods[methodName] = this.methods[methodName].filter(({ handler: h }) => h !== handler);
  }

  private send(method: string, message: any){
    const stringfiedMessage = JSON.stringify({ method, ...message });

    if (!this._WSService.ready){
      this.requestQueue.push({ message, name: method });
      return
    }

    this.ws.send(stringfiedMessage);
  }

  // Manda a mensagem com método GET_ALL
  public getAll(body: GetAllMessageBody){
    this.send('GET_ALL', body);
  }


  private getMethodHandlers(methodName: string){
    const method = this.methods[methodName];
    if (!method) {
        // throw new Error(`Método: ${name} não existe.`);
        console.warn(`Método: ${methodName} não existe.`);
        return [];
    }
      
    return method;
  }

}

interface ProfessionalDataServiceMethod {
  [key: string]: {
    handler: WebsocketMessageHandler,
    context?: ThisType<any>
  }[]
}

interface RequestedMethod {
  name: string,
  message: any,
}

