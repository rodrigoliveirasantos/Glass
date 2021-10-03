import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CellData } from '../shared/interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class CellDataService {
  private subject = new Subject<any>();
  CellStates;

  constructor() {
    enum CellStates {
      // Esses três primeiros correspondem a estados guardados no servidor
      BLOCKED_BY_ADMIN = 0,
      BLOCKED_BY_PROFESSIONAL = 1,
      OPEN = 2,

      // Os valores a seguir só devem ser usados no front-end
      BLOCKED_BY_HOLIDAY = 3,
    }

    this.CellStates = CellStates
   }

  public subscribe(observer: (data: CellData) => void ){
    this.subject.subscribe(observer);
  }

  public emit(data: CellData){
    this.subject.next(data);
  }
}
