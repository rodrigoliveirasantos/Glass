import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProfessionalDataService } from 'src/app/services/professional-data.service';
import { RoomService } from 'src/app/services/room.service';
import { Room } from 'src/app/shared/interfaces/types';

@Component({
  selector: 'app-room-creation-form',
  templateUrl: './room-creation-form.component.html',
  styleUrls: ['./room-creation-form.component.scss']
})
export class RoomCreationFormComponent implements OnInit, OnChanges {
  @Input('data') data!: RoomCreationFormInput;
  controls: any
  form!: FormGroup;

  constructor(
    private _roomService: RoomService,
    private _professionalDataService: ProfessionalDataService,
    private _authService: AuthService,
    private _modalService: ModalService,
  ){ 
    this.controls = {
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    }
  
    this.form = new FormGroup(this.controls);

    this._professionalDataService.on('ADD_ROOM', (message) => {
      if (parseInt(message.componentId!) === this._authService.getSession().id){
        this._modalService.success('A sala foi criada com sucesso!');
        this.form.enable();

        this._modalService.close('room-creation');
      }
    });

    this._professionalDataService.on('UPDATE_ROOM', (message) => {
      if (parseInt(message.componentId!) === this._authService.getSession().id){
        this._modalService.success('A sala foi atualizada com sucesso!');
        this.form.enable();

        this._modalService.close('room-creation');
      }
    });
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    if (this.data && this.data.mode === 'edit') this.controls.name.value = this.data.selectedRoom.name
  }

  onSubmit(){
    this.form.disable();

    if (this.data.mode === 'creation'){
      this.createRoom();
    } else {
      this.editRoom();
    }
  }

  createRoom(){
    this._roomService.addRoom({
      room: {
        name: this.controls.name.value.trim(),
      },
      
      componentId: this._authService.getSession().id
    });
  }

  editRoom(){
    this._roomService.updateRoom({
      room: {
        id: this.data.selectedRoom.id,
        name: this.controls.name.value.trim(),
      },
      
      componentId: this._authService.getSession().id
    });
  }

}


interface RoomCreationFormInput {
  mode: 'edit' | 'creation',
  selectedRoom: Room,
}