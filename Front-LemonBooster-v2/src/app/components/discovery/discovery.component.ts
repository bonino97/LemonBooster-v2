import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.scss']
})
export class DiscoveryComponent implements OnInit {

  _waybackurls:boolean = true; 
  _spider:boolean = false; 
  _directoryBruteforce:boolean = false; 
  executing: boolean = false;

  constructor(public socket: Socket) { }

  ngOnInit(): void {
    this.checkStatus();
  }
  
  open(value){
    switch(value){
      case 1: 
        this._waybackurls = true; 
        this._spider = false; 
        this._directoryBruteforce = false; 
        break;
      case 2: 
        this._waybackurls = false; 
        this._spider = true; 
        this._directoryBruteforce = false; 
        break;
      case 3: 
        this._waybackurls = false; 
        this._spider = false; 
        this._directoryBruteforce = true; 
        break;
    }
  }

  checkStatus(){
    this.socket.on('connect', () => {
      console.log('Connected to Server.');;
      this.executing = false;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Server.');
      this.executing = true;
    });
  }


}
