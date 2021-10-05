import { HttpHeaders, HttpClient, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlassHttpResponse } from '../shared/interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly url = `${environment.url_api}`;
  // O ideal é que o content-type seja text/plain para não
  // ativar o preflight do cors. Colocar como application/json não muda nada.
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'text/plain;charset=UTF-8',
  });

  constructor(private _http: HttpClient ) { }

  // Faz uma requisição genérica usando as opções do usuário.
  private async fetch(method: string, url: string, options?: GlassFetchOptions){
    // Junta os headers padrão com os enviados por argumento
    const headers = this.headers;
    if (options && options.headers){
      options.headers.keys().forEach(key => {
        headers.append(key, options.headers!.get(key)!);
      })
    }

    // Monta as opções da requisição
    const body = options?.body || {};

    const requestOptions = new HttpRequest(method, url.includes('http') ? url : this.url + url, body,{ 
      headers: headers,
      responseType: 'json'
    });

    let result: GlassHttpResponse;
    // Formata a resposta para idependente do caso, enviar um GlassHttpRepsonse.
    // No caso do erro na requisição o code é 0
    try {
      const httpEvent = await this._http.request<GlassHttpResponse>(requestOptions).toPromise() as HttpResponse<GlassHttpResponse>;
      result = httpEvent.body!;
      
    } catch(error) {
      let typedError = error as HttpErrorResponse;

      const responseError = {
        code: typedError.status,
        success: false,
        error: typedError.message,
        data: null
      }

      result = responseError;
    }

    return result;
  } 

  public get(url: string, options?: GlassFetchOptions){
    return this.fetch('GET', url, options);
  }

  public post(url: string, options?: GlassFetchOptions){
    return this.fetch('POST', url, options);
  }
  
}


interface GlassFetchOptions {
  body?: any,
  headers?: HttpHeaders
}

