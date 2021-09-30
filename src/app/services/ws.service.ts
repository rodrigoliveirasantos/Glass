import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WSService {
  private tries = 0;
  private ws!: WebSocket | null;
  public wsObserver = new Observable<WebSocket>(this.onSubscribe.bind(this));
  public ready = false;

  constructor(private _router: Router) {
    
  }

  private onSubscribe(observer: Subscriber<unknown>){
    if (this.ws) return observer.next(this.ws);
    this.createConnection('ws://localhost:9876/schedule', observer);
  }

  private createConnection = (url: string, observer?: Subscriber<unknown>, errorData?: any) => {
    if (errorData){
      console.log(errorData);
    }

    if (this.tries++ === 8){ 
      alert('Houve um erro ao se conectar com o servidor.');
      this._router.navigate(['/']);
      return;
    };

    console.log('Tentativa ' + this.tries + ' de conectar com o servidor...');

    const client = new WebSocket(url);

    client.addEventListener('open', (event) => {
      this.ready = true;
      this.ws = event.target as WebSocket;
      observer?.next(this.ws);

      client.addEventListener('close', () => { 
        this.ws = null; 
        this.ready = false; 
        this.tries = 0 
      });
    });

    client.addEventListener('error', (event) => {
      this.createConnection(url, observer, event);
    });
  }

  public getClient(){
    return this.ws;
  }
}
