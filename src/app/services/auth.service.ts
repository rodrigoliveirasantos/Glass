import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly url = `${environment.url_api}user/login`;
  private readonly tokenFieldName = 'user_token';

  constructor(private http: HttpClient) { }

  public async login(username: string, password: string) {
    const body = {
      username: 'diogo2550',
      password: '12345'
    };
    const observable = await this.http.post(this.url, body).toPromise();

    console.log(observable);
  }

  public logout() {

  }

  public isLogged() {
    return localStorage.getItem(this.tokenFieldName) != null;
  }

  /** Pode ser usado para obter alguma informações de dentro do token😡
   * @return string|undefined string a chave exista, null caso a chave seja inválida.
   */
  public getTokenData(key: string): string {
    let token = localStorage.getItem('user_token');
    if(!token) {
      return 'Token inexistente';
    }

    let payload = atob(token.split('.')[1]);
    let data = JSON.parse(payload)[key];

    return data;
  }

}
