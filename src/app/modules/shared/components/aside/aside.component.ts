import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
  userName: string;
  isAdmin: boolean;
  currentActiveItem!: HTMLElement;

  constructor(public _authService: AuthService) {
    const session = this._authService.getSession();
    this.userName = session.name;
    this.isAdmin = this._authService.getSession().isAdmin;
  }

  ngOnInit(): void {
  }

  setItemActive(event: MouseEvent){
    this.currentActiveItem?.classList.remove('active');
    this.currentActiveItem = event.target as HTMLElement;
    this.currentActiveItem.classList.add('active')
  }
}
