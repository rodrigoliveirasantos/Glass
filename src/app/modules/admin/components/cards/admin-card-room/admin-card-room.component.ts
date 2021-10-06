import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { RoomService } from 'src/app/services/room.service';
import { Room } from 'src/app/shared/interfaces/types';
import { AuthService } from 'src/app/services/auth.service';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';

@Component({
  selector: 'app-admin-card-room',
  templateUrl: './admin-card-room.component.html',
  styleUrls: ['./admin-card-room.component.scss']
})
export class AdminCardRoomComponent implements OnInit {
  selectedElement!: HTMLElement;
  selectedRoom!: Room | null;
  rooms: Room[] = [];

  constructor(
    private _roomService: RoomService, 
    private  _modalService: ModalService,
    private _authService: AuthService,
    private _professionalDataSerivce: ProfessionalDataService,
  ) { 
    this._roomService.getRooms((rooms) => {
      this.rooms = rooms;
    });

    this._roomService.onChanges((rooms) => {
      this.rooms = rooms;
    });

    this._professionalDataSerivce.on('DELETE_ROOM', (message) => {
      if (parseInt(message.componentId!) === this._authService.getSession().id){
        this._modalService.success('A sala foi deletada com sucesso!');

        this.selectedRoom = null;
      }
    });

    this._professionalDataSerivce.on('DELETE_ROOM_ERROR', (message) => {
      if (parseInt(message.componentId!) === this._authService.getSession().id){
        this._modalService.error('Houve um erro ao deletar a sala.');
      }
    });
  }

  ngOnInit(): void {
  }

  onClickOnItem(event: MouseEvent, room: Room){
    this.selectedElement?.classList.remove('active');
    this.selectedElement = event.target as HTMLElement;
    this.selectedElement.classList.add('active');

    this.selectedRoom = room;
  }

  sendToCreateRoom(){
    this._modalService.open('room-creation', { mode: 'creation', selectedRoom: this.selectedRoom!, modalTitle: 'Criar sala' });
  }

  sendToEditRoom(){
    this._modalService.open('room-creation', { mode: 'edit', selectedRoom: this.selectedRoom!, modalTitle: 'Editar sala' });
  }

  sendToDeleteRoom(){
    this._modalService.confirmation({
      message: `Voce deseja deletar a sala <b>${this.selectedRoom!.name}?</b>`,
      onConfirm: (close) => {
        this._roomService.deleteRoom({
          roomId: this.selectedRoom!.id,
          componentId: this._authService.getSession().id
        })

        close();
      }
    })
  }

}
