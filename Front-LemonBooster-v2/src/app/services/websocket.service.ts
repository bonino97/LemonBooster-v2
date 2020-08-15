import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus: boolean  = false;

  constructor(
    public socket: Socket, 
    private router: Router
  ) { }

  CheckStatus(){
    this.socket.on('connect', () => {
      console.log('Connected to Server.');
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Server.');
      this.socketStatus = false;
    });
  }

  Emit( event: string, payload?: any, callback?: Function  ) {
    this.socket.emit(event, payload, callback); 
  }

  Listen( event: string ) {
    return this.socket.fromEvent( event );
  }


}
