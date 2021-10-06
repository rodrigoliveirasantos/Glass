import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {

  constructor(private _WSService: WSService, private _router: Router, private _route: ActivatedRoute) {
   
  }

  ngOnInit(): void {
    if (!this._WSService.ready){
      this._WSService.wsObserver.subscribe(() => {
        this._router.navigate(['../calendario'], { relativeTo: this._route });
      });

    } else {
      this._router.navigate(['../calendario'], { relativeTo: this._route });
    }
  }

}
