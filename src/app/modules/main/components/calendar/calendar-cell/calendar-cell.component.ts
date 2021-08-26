import { Component, HostListener, OnInit } from '@angular/core';


@Component({
  selector: 'app-calendar-cell',
  templateUrl: './calendar-cell.component.html',
  styleUrls: ['./calendar-cell.component.scss'],
})
export class CalendarCellComponent implements OnInit {
  otherMonth: boolean = false;
  state: number = 0;
  day: number = 0;
  date!: Date;
  data!: any;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('click')
  private onClick(){
    console.log(this.date);
  }

  public setData(data: any){
    console.log(data);
    this.data = data;
  }
}
