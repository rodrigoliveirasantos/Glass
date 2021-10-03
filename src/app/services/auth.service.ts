import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenFieldName = 'user_token';
  constructor(private _http: HttpService) { }

  public async login(cpf: string, password: string): Promise<boolean> {
    const body = { cpf, password };
    const data = await this._http.post(`user/login`, { body: body })
  
    if(data.success) {
      this.setToken(data.data.token);
      return true;
    }
    return false;
  }

  /** Usado para saber se o usuário possui uma sessão ativa. A sessão só terminará quando o método logout() for chamado */
  public logout() {
    localStorage.removeItem(this.tokenFieldName);
  }

  public isLogged() {
    return this.getToken() != null;
  }

  /** Pode ser usado para obter alguma informações de dentro do token 😡.
   * Dentro do token você terá as opções: cpf, name, id
   * @return string|undefined string a chave exista, null caso a chave seja inválida.
   */
  public getTokenData(key: ValidKeys): string {
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
      cpf: this.getTokenData('id'),
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
