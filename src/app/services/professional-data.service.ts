import { Injectable } from '@angular/core';
import { WebsocketResponse, WebsocketMessageHandler, GetAllRequestBody, AddAppointmentRequestBody, DeleteAppointmentRequestBody, AddEventualScheduleRequestBody, EventualStates, Frequency, CellStates, DeleteEventualScheduleRequestBody, GetSchedulesRequestBody } from '../shared/interfaces/types';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { WSService } from './ws.service';



// Serviço responsável por fazer a conversa com o Websocket Server sobre os dados dos profissionais.
@Injectable({
  providedIn: 'root'
})
export class ProfessionalDataService {
  private ws!: WebSocket;
  private readonly errorMethodSuffix = 'ERROR';
  // Guarda os handlers registrados para os eventos.
  private methods: ProfessionalDataServiceMethod = {
    GET_ALL: [],
    GET_ALL_ROOMS: [],
    OPEN: [],
    ADD_APPOINTMENT: [],
    DELETE_APPOINTMENT: [],
    ADD_EVENTUAL_SCHEDULE: [],
    DELETE_EVENTUAL_SCHEDULE: [],
    GET_SCHEDULES: [],
  };

  // Guarda todas as requisições que foram feitas enquanto o Websocket se conectava.
  private requestQueue: RequestedMethod[] = [];

  constructor(private _WSService: WSService, private _httpService: HttpService, private _authService: AuthService) { 
    // Adiciona os métodos de erro no objeto de métodos
    Object.keys(this.methods).forEach((key) => {
      this.methods[key + '_' + this.errorMethodSuffix] = [];
    });

    // Se conecta com o Websocket e faz todas as requisições agendadas.
    this._WSService.wsObserver.subscribe((ws: WebSocket) => {
      this.ws = ws;

      this.ws.addEventListener('message', ({ data }) => {
        data = JSON.parse(data);

        if (!data.success){
          throw Error(data.error + ' ' + data.code);
        }

        this.sendToHandlers(data.method, data);
      });

      this.requestQueue.forEach(requestedMethod => {
        this.send(requestedMethod.name, requestedMethod.message);
      });

      this.requestQueue = [];
    })
    
  }

  // Passa a mensagem a todos os handlers aplicando o contexto indicado.
  public sendToHandlers(methodName: string, data: WebsocketResponse): void {
    const methodHandlers = this.getMethodHandlers(methodName);
    methodHandlers.forEach(({ handler, context }) => {  
      context ?  handler.apply(context, [data, this]) : handler(data, this);
    });
  }

  // Adiciona um handler para um tipo de mensagem websocket especifico.
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

  private send(method: string, message: any = {}){
    const stringfiedMessage = JSON.stringify({ method, ...message, token: this._authService.getToken() });

    if (!this._WSService.ready){
      this.requestQueue.push({ message, name: method });
      return
    }

    this.ws.send(stringfiedMessage);
  }

  /* =============================================================== 
    Métodos do Websocket - 

    Todos eles enviam uma mensagem com o método do nome 
    função com exceção de funções criadas como interface para usar
    um método. Nelas o token já é injetado por padrão.
  ===============================================================  */

  public getAll(body: GetAllRequestBody){
    this.send('GET_ALL', body);
  }

  public getAllRooms(){
    this.send('GET_ALL_ROOMS');
  }

  public addEventualSchedule(body: AddEventualScheduleRequestBody){
    this.send('ADD_EVENTUAL_SCHEDULE', body);
  }

  public deleteEventualSchedule(body: DeleteEventualScheduleRequestBody){
    this.send('DELETE_EVENTUAL_SCHEDULE', body);
  }

  public getSchedules(body: GetSchedulesRequestBody){
    this.send('GET_SCHEDULES', body);
  }   
  
  /**  
   * Chama o método 'ADD_EVENTUAL_SCHEDULE' passando o eventualState como 
   * BLOCKED_BY_ADMIN caso o usuário logado seja um administrador ou BLOCKED_BY_PROFESSIONAL
   * caso não seja.
  */
   public blockDay(body: BlockDayBody){
    const isAdmin = this._authService.getSession().isAdmin;

    const requestBody: AddEventualScheduleRequestBody = {
      employeeId: body.employeeId,
      eventualSchedule: {
        id: 42069,
        eventualState: isAdmin ? EventualStates.BLOCKED_BY_ADMIN : EventualStates.BLOCKED_BY_PROFESSIONAL,
        ...body.eventualSchedule,
      },
      componentId: body.componentId,
    };

    this.addEventualSchedule(requestBody);
  }

  /**  
   * Chama o método 'ADD_EVENTUAL_SCHEDULE' passando o eventualState como OPEN.
   * @return {boolean} **false** se o usuário não tem permissão para desbloquear o dia. **true** se o usuário pode.
  */
   public unlockDay(body: UnlockDayBody){
    const canUnlockDay = this.userCanUnlockDay(body.currentCellState);

    if (!canUnlockDay) return false;

    const requestBody: DeleteEventualScheduleRequestBody = {
      employeeId: body.employeeId,
      eventualScheduleId: body.eventualScheduleId, 
      componentId: body.componentId,
    };

    this.deleteEventualSchedule(requestBody);
    return true;
  }

  /* Métodos HTTP */
  public async addAppointment(body: AddAppointmentRequestBody){
    const response = await this._httpService.post('appointment/make', { body });
    return response;
  } 

  public async deleteAppointment(body: DeleteAppointmentRequestBody){
    const response = await this._httpService.post('appointment/cancel', { body });
    return response;
  } 

  // Retorna todos os handlers do evento passado. Caso não
  // exista, emite um aviso e retorna um array vazio
  private getMethodHandlers(methodName: string){ 
    const method = this.methods[methodName];
    if (!method) {
        // throw new Error(`Método: ${name} não existe.`);
        console.warn(`Método: ${methodName} não existe.`);
        return [];
    }
      
    return method;
  }

  private userCanUnlockDay(blockState: CellStates | EventualStates){
    const isAdmin = this._authService.getSession().isAdmin;
    if (isAdmin) return true;

    return blockState === CellStates.BLOCKED_BY_PROFESSIONAL;
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

interface BlockDayBody {
  eventualSchedule: {
    startTime: string,
    endTime: string,
    frequency: Frequency,
    eventualDate: string
  }

  employeeId: number,
  componentId?: string
}

interface UnlockDayBody extends DeleteEventualScheduleRequestBody{
    currentCellState: CellStates,
}
