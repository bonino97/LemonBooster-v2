import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { Component, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-alive',
  templateUrl: './alive.component.html',
  styleUrls: ['./alive.component.scss']
})
export class AliveComponent implements OnInit {

  actualPage;
  previousPage;
  nextPage;
  range: Number[] = [];
  totalPages: Number;
  limit = 5;
  filter = '';

  disablePreviousButton: boolean = false;
  disableNextButton: boolean = false;
  disableNextFiveButton: boolean = false;
  disablePreviousFiveButton: boolean = false;

  scope: any;
  alives: any;

  executing: boolean = false;
  socketStatus: boolean;

  program: any;
  alive: any;

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

  executeAlive(scope){
    this.route.params.subscribe(
      (data) => {

        let Scope = {
          Scope: scope
        }

        this.toolService.ExecuteAlive(data['url'], Scope)
          .subscribe((data:any) => {
            this.alive = data.data;
            this.executing = true;
            
            var Payload = {
              Subdomain: data.subdomain,
              Alive: this.alive
            }
            
            this.toolService.WsExecuteAlive(Payload); // Ejecuto herramienta.
          }, (error) => {
            console.error(error);
          });
      });
      
  }

  getAlives(scope){
    this.scope = scope;
    this.route.params.subscribe(
      (data) => { 
        this.programService.GetAlivesByScope(data['url'], 1, 5, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          console.error(error);
        });
      });
  }

  next(){ //Pagina Siguiente
    
    this.route.params.subscribe(
      (data) => { 
        this.programService.GetAlivesByScope(data['url'], this.nextPage, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          console.error(error);
        });
      });
  }

  previous(){ //Pagina Previa
    
    this.route.params.subscribe(
      (data) => { 
        this.programService.GetAlivesByScope(data['url'], this.previousPage, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          console.error(error);
        });
      });
  }


  nextFive(){
    this.route.params.subscribe(
      (data) => { 
        this.programService.GetAlivesByScope(data['url'], this.actualPage+5, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          console.error(error);
        });
      });
  }

  previousFive(){
    this.route.params.subscribe(
      (data) => { 
        this.programService.GetAlivesByScope(data['url'], (this.actualPage-5), this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          console.error(error);
        });
      });
  }

  dataTableValidations(data){
    this.totalPages = data.totalPages;
    this.alives = [];
    this.alives = data.results;
    this.actualPage = data.actualPage;
    this.range = [];

    if((this.actualPage+5) < data.totalPages){
      this.disableNextFiveButton = false;
    } else {
      this.disableNextFiveButton = true;
    }

    if((this.actualPage) > 5){
      this.disablePreviousFiveButton = false;
    } else {
      this.disablePreviousFiveButton = true;
    }
    
    if(!!data.previousPage){
      this.previousPage = data.previousPage.page;
      this.disablePreviousButton = false;
    } else {
      this.disablePreviousButton = true;
    };
    
    if(!!data.nextPage){
      this.nextPage = data.nextPage.page;
      this.disableNextButton = false;
    } else {
      this.disableNextButton = true;
    };
  }

  entriesChange($event) {
    this.limit = $event.target.value;
    this.route.params.subscribe(
      (data) => { 
        this.programService.GetAlivesByScope(data['url'], this.actualPage, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          console.error(error);
        });
      });
  }

  filterTable($event) {
    this.filter = $event.target.value;
    if ($event.keyCode === 13) {
      this.route.params.subscribe(
        (data) => { 
          this.programService.GetAlivesByScope(data['url'], this.actualPage, this.limit, this.scope, this.filter)
          .subscribe(data => {
            console.log(data);
            this.dataTableValidations(data);
          }, (error) => {
            console.error(error);
          });
        });
    }
  }

  openAlive(alive) {
    window.open(alive, "_blank");
  }

}
