import { environment } from './../../../environments/environment';
import { ProgramService } from 'src/app/services/program.service';
import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import swal from "sweetalert2";


@Component({
  selector: 'app-screenshots',
  templateUrl: './screenshots.component.html',
  styleUrls: ['./screenshots.component.scss']
})
export class ScreenshotsComponent implements OnInit {

  program:any;
  socketStatus: boolean = false;
  executing: boolean = false;

  screnshots:any;
  screenshotFile: any;
  

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
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
        });
      });

      this.toolService.GetExecutedScreenshots()
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

  executeScreenshots(scope){
    this.route.params.subscribe(
      (data) => {

        let Scope = {
          Scope: scope
        }
        
        this.toolService.ExecuteScreenshots(data['url'], Scope)
          .subscribe((data:any) => {

            this.screnshots = data.data;
            this.executing = true;
            
            var Payload = {
              Screenshots: this.screnshots,
              Alives: data.alives
            }
            
            this.toolService.WsExecuteScreenshots(Payload); // Ejecuto herramienta.
            
          }, (error) => {
            swal.fire({
              html: `<span style='color:grey'>${error.error.msg}<span>`,
              timer: 2500,
              showConfirmButton: false
            });
          });
      });
      
  }

  getScreenshots(scope){
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetScreenshotsFile(data['url'], scope).subscribe(
          (data:any) => {
            this.screenshotFile = data.data.UrlFile;
            window.open(`http://${localStorage.getItem('IpVPS')}:5000/Static/${this.screenshotFile}`, "_blank");
          },(error) => {
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
      });
    });
  }
}
