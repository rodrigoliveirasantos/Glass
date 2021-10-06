import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/shared/interfaces/types';

@Component({
  selector: 'app-admin-card-room',
  templateUrl: './admin-card-room.component.html',
  styleUrls: ['./admin-card-room.component.scss']
})
export class AdminCardRoomComponent implements OnInit {
  selectedRoom!: Room;

  constructor() { }

  ngOnInit(): void {
  }

}
