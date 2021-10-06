import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit, OnDestroy {

  constructor(private _modalService: ModalService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this._modalService.removeAll();
  }
}
