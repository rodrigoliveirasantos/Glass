import { Injectable } from '@angular/core';
import { AddRoomRequestBody, DeleteRoomRequestBody, Room, UpdateRoomRequestBody, WebsocketResponse } from '../shared/interfaces/types';
import { ModalService } from './modal.service';
import { ProfessionalDataService } from './professional-data.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private rooms: Room[] = [];
  private queue: ScheduledRequest[] = [];
  private changeListeners: RoomDataHandler[] = [];

  constructor(
    private _professionalDataService: ProfessionalDataService,
    private _modalService: ModalService
  ) { 
    this._professionalDataService.on('GET_ALL_ROOMS', this.onGetAllRooms);
    this._professionalDataService.on('GET_ALL_ROOMS_ERROR', (message) => {
      this._modalService.error('Houve um erro ao pegar ao pegar as salas. Por favor, tente novamente mais tarde. Detalhes: <br/><br/>' + message.error);
    });

    this._professionalDataService.on('ADD_ROOM', (message) => {
      this.rooms.push(message.data.room);
    });

    this._professionalDataService.on('ADD_ROOM_ERROR', (message) => {
      console.error(message.error);
      this._modalService.error('Houve um erro ao criar a sala. Por favor, tente novamente mais tarde. Detalhes: <br/><br/>' + message.error);
    });

    this._professionalDataService.on('UPDATE_ROOM', (message) => {
      const updatedRoom = message.data.room;
      const room = this.rooms.find(room => room.id === updatedRoom.id);

      if (!room){
        this._modalService.error('Houve um erro ao encontrar a sala para atualizar.');
        return
      }

      room.name = updatedRoom.name;
      this.emitChange('UPDATE_ROOM', updatedRoom);
    });

    this._professionalDataService.on('DELETE_ROOM', (message) => {
      const deletedRoom = message.data.room;
      this.rooms = this.rooms.filter(room => room.id !== deletedRoom.id);

      this.emitChange('DELETE_ROOM', deletedRoom);
    });

    this._professionalDataService.getAllRooms();
  }


  updateRoom(body: UpdateRoomRequestBody){
    this._professionalDataService.updateRoom(body);
  }

  deleteRoom(body: DeleteRoomRequestBody){
    this._professionalDataService.deleteRoom(body);
  }

  addRoom(body: AddRoomRequestBody){
    this._professionalDataService.addRoom(body);
  }

  onChanges(cb: RoomDataHandler){
    this.changeListeners.push(cb);
  }

  removeChangeListener(cb: RoomDataHandler){
    this.changeListeners = this.changeListeners.filter(listener => listener !== cb);
  }

  emitChange(operation: string, room?: Room,){
    this.changeListeners.forEach(listener => listener(this.rooms, operation, room));
  }

  // GetRooms recebe um callback porque caso o serviço ainda não tenha baixado as salas,
  // será necessário fazer uma requisição websocket para baixar.
  getRooms(cb: RoomDataHandler, context?: ThisType<any>){
    if (this.rooms.length > 0) {
      cb.apply(context ? context : null, [ this.rooms, 'GET_ALL_ROOMS' ]);
    } else {
      this.queue.push({
        handler: cb,
        context: context
      });
    }
  }

  private onGetAllRooms = (message: WebsocketResponse, service: ProfessionalDataService) => {
    this.rooms = message.data.rooms;
    this.queue.forEach(request => request.handler.apply(request.context || null, [this.rooms, 'GET_ALL_ROOMS']));
    this.queue = [];

    service.unsubscribe('GET_ALL_ROOMS', this.onGetAllRooms);
  }
}

type RoomDataHandler = (rooms: Room[], operation: string, changedRoom?: Room ) => void;

interface ScheduledRequest {
  handler: RoomDataHandler,
  context?: ThisType<any>,
}

