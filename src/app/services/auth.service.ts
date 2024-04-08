import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { WSService } from './ws.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenFieldName = 'user_token';
  constructor(private _http: HttpService, private _router: Router, private _wsService: WSService) { }

  public async login(cpf: string, password: string) {
    const body = { cpf, password };
    const data = await this._http.post(environment.url_api + `/user/login`, { body: body })

    console.log(environment.url_api + `/user/login`);

    if(data.success) {
      this.setToken(data.data.token);
    }

    return data;
  }

  /** Usado para saber se o usuário possui uma sessão ativa. A sessão só terminará quando o método logout() for chamado */
  public logout() {
    localStorage.removeItem(this.tokenFieldName);
    this._router.navigate(['/']);
  }

  public isLogged() {
    return this.getToken() != null;
  }

  /** Pode ser usado para obter alguma informações de dentro do token 😡.
   * Dentro do token você terá as opções: cpf, name, id
   * @return string|undefined string a chave exista, null caso a chave seja inválida.
   */
  public getTokenData(key: ValidKeys): any {
    let token = this.getToken();
    if(!token) {
      return 'Token inexistente';
    }

    let payload = atob(token.split('.')[1]);
    let data = JSON.parse(payload)[key];

    return data;
  }

  public getSession(){
    return {
      id: this.getTokenData('id'),
      isAdmin: this.getTokenData('isAdmin'),
      name: this.getTokenData('name'),
    }
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenFieldName, token);
  }

  public getToken() {
    return localStorage.getItem(this.tokenFieldName);
  }

}

type ValidKeys = 'isAdmin' | 'name' | 'id'
