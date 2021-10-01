import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlassHttpResponse } from '../shared/interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url = `${environment.url_api}user/`;
  private readonly tokenFieldName = 'user_token';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'text/plain;charset=UTF-8',
    });
  }

  public async login(cpf: string, password: string): Promise<boolean> {
    const body = { cpf, password };
    const response: GlassHttpResponse = await this.http.post<GlassHttpResponse>(`${this.url}login`, body, {
      	headers: this.headers
    }).toPromise();

    if(response.success) {
      this.setToken(response.data.token);
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
   * Dentro do token você terá as opções: email, name, id
   * @return string|undefined string a chave exista, null caso a chave seja inválida.
   */
  public getTokenData(key: string): string {
    let token = this.getToken();
    if(!token) {
      return 'Token inexistente';
    }

    let payload = atob(token.split('.')[1]);
    let data = JSON.parse(payload)[key];

    return data;
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenFieldName, token);
  }

  private getToken() {
    return localStorage.getItem(this.tokenFieldName);
  }

}
