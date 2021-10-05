import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
  userName: string;

  constructor(public _authService: AuthService) {
    const session = this._authService.getSession();
    this.userName = session.name;
  }

  ngOnInit(): void {
  }

}
