import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    if(this.authService.isLogged()) {
      console.log('Usuário já está logado XD');
    } else {
      let login = await this.authService.login('11111111111','12345678');
      if(login) {
        console.log('logado :D')
      } else {
        console.log('não logado D:')
      }
    }
  }

}
