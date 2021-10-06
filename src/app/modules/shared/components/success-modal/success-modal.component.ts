import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit, OnChanges {
  @Input('data') data!: { message: string, success: boolean };

  constructor() { }

  ngOnChanges(): void {
    if (typeof this.data.success === 'undefined'){
      this.data.success = true;
    }
  }

  ngOnInit(): void {
  }

}
