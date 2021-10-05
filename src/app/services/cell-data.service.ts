import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CellData } from '../shared/interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class CellDataService {
  private subject = new Subject<any>();

  constructor() {
    
  }

  public subscribe(observer: (data: CellData) => void ){
    this.subject.subscribe(observer);
  }

  public emit(data: CellData){
    this.subject.next(data);
  }
}
