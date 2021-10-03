import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnDestroy {
  loginError = false;

  controls = {
    cpf: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern(/(\d)/)]),
    password: new FormControl('', Validators.required)
  }

  form = new FormGroup(this.controls);

  constructor(private _authService: AuthService, private _router: Router, private _route: ActivatedRoute) { 
    if (this._authService.isLogged()) this._authService.logout();
  }

  ngOnDestroy(){
    this.form.enable();
  }

  async onSubmit(){
    this.form.disable();
    this.loginError = false;

    const cpf = this.controls.cpf.value;
    const password = this.controls.password.value;

    let login = await this._authService.login(cpf, password);

    if(login) {
      this._router.navigate(['app'], { relativeTo: this._route.root })
    } else {
      this.loginError = true;
      this.form.enable();
    }
  }

}
