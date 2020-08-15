import { WebsocketService } from './../../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-subdomains',
  templateUrl: './subdomains.component.html',
  styleUrls: ['./subdomains.component.scss']
})
export class SubdomainsComponent implements OnInit {

  program:any;
  subdomainEnumeration:any;
  wsSubdomainEnumeration:any;
  socketStatus: boolean = false;
  executing: boolean = false;

  constructor(
    public route : ActivatedRoute,
    public toolService:ToolsService,
    public socket: Socket 
  ) { }

  ngOnInit(): void {
    this.CheckStatus();
    this.route.params.subscribe(
      (data) => {
        this.toolService.GetSubdomainEnumeration(data['url'])
        .subscribe((data:any) => {
          this.program = data.data;
        });
      });

      this.toolService.GetExecutedSubdomainEnumeration().subscribe(data => console.log(data));
      
  }

  CheckStatus(){
    this.socket.on('connect', () => {
      console.log('Connected to Server.');
      this.socketStatus = true;
      this.executing = false;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Server.');
      this.socketStatus = false;
      this.executing = true;
    });
  }

  executeSubdomainEnumeration(scope){
    this.route.params.subscribe(
      (data) => {

        let Scope = {
          Scope: scope
        }

        this.toolService.ExecuteSubdomainEnumeration(data['url'], Scope)
          .subscribe((data:any) => {
            this.subdomainEnumeration = data.data;
            this.executing = true;
            this.toolService.WsExecuteSubdomainEnumeration(this.subdomainEnumeration); // Ejecuto herramienta.
          });
      });
      
  }

}
