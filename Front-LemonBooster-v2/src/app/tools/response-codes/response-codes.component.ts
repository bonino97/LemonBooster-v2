import { ProgramService } from 'src/app/services/program.service';
import { Socket } from 'ngx-socket-io';
import { ToolsService } from 'src/app/services/tools.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";

@Component({
  selector: 'app-response-codes',
  templateUrl: './response-codes.component.html',
  styleUrls: ['./response-codes.component.scss']
})
export class ResponseCodesComponent implements OnInit {

  scope: any;
  subdomains: any;

  program:any;

  socketStatus: boolean = false;
  executing: boolean = false;

  constructor(
    public route : ActivatedRoute,
    public toolService:ToolsService,
    public socket: Socket,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.checkStatus();
    this.route.params.subscribe(
      (data) => {
        this.toolService.GetEnumerationProgram(data['url'])
        .subscribe((data:any) => {
          this.program = data.data;
        }, (error) => {
          console.error(error);
        });
      });

    this.toolService.GetExecutedSubdomainResponseCodes()
    .subscribe((data:any) => {
      if(data.executing){
        this.executing = true;
        swal.fire({
          html: `<span style='color:grey'>${data.msg}<span>`,
          timer: 20000,
          showConfirmButton: false
        });
      } else {
        this.executing = false;
        swal.fire({
          html: `<span style='color:grey'>${data.msg}<span>`,
          timer: 1000,
          showConfirmButton: false
        });
      }
    }, (error) => {
      swal.fire({
        html: `<span style='color:grey'>${error.error.msg}<span>`,
        timer: 2500,
        showConfirmButton: false
      });
    });
  }


  checkStatus(){
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

  executeResponseCodesScanning(scope) {
    this.route.params.subscribe(
      (data) => {

        let Scope = {
          Scope: scope
        }
        
        this.toolService.ExecuteSubdomainResponseCodes(data['url'], Scope)
          .subscribe((data:any) => {

            this.executing = true;
            
            var Payload = {
              Alives: data.alives,
              Enumeration: data.data
            }

            this.toolService.WsExecuteSubdomainResponseCodes(Payload); // Ejecuto herramienta.
            
          }, (error) => {
            console.error(error);
            swal.fire({
              html: `<span style='color:grey'>${error.error.msg}<span>`,
              timer: 2500,
              showConfirmButton: false
            });
          });
      });
  }

}
