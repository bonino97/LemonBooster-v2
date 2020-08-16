import { ProgramService } from 'src/app/services/program.service';
import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import swal from "sweetalert2";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-subdomains',
  templateUrl: './subdomains.component.html',
  styleUrls: ['./subdomains.component.scss']
})
export class SubdomainsComponent implements OnInit {

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
  subdomains: any;

  program:any;
  subdomainEnumeration:any;
  wsSubdomainEnumeration:any;
  socketStatus: boolean = false;
  executing: boolean = false;

  programUrl: any;

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
        this.toolService.GetSubdomainEnumeration(data['url'])
        .subscribe((data:any) => {
          this.program = data.data;
        }, (error) => {
          console.error(error);
        });
      });

      this.toolService.GetExecutedSubdomainEnumeration()
      .subscribe((data:any) => {
        swal.fire({
          html: `<span style='color:grey'>${data.msg}<span>`,
          timer: 12000,
          showConfirmButton: false
        }).then( () => {
          this.executing = true;
        });
      }, (error) => {
        console.error(error);
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
          }, (error) => {
            console.error(error);
          });
      });
      
  }

  getScopeSubdomains(scope){
    this.scope = scope;
    this.route.params.subscribe(
      (data) => { 
        this.programService.GetProgramSubdomainsByScope(data['url'], 1, 5, this.scope, this.filter)
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
        this.programService.GetProgramSubdomainsByScope(data['url'], this.nextPage, this.limit, this.scope, this.filter)
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
        this.programService.GetProgramSubdomainsByScope(data['url'], this.previousPage, this.limit, this.scope, this.filter)
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
        this.programService.GetProgramSubdomainsByScope(data['url'], this.actualPage+5, this.limit, this.scope, this.filter)
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
        this.programService.GetProgramSubdomainsByScope(data['url'], (this.actualPage-5), this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          console.error(error);
        });
      });
  }

  dataTableValidations(data){
    this.totalPages = data.totalPages;
    this.subdomains = [];
    this.subdomains = data.results;
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
        this.programService.GetProgramSubdomainsByScope(data['url'], this.nextPage, this.limit, this.scope, this.filter)
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
          this.programService.GetProgramSubdomainsByScope(data['url'], this.actualPage, this.limit, this.scope, this.filter)
          .subscribe(data => {
            console.log(data);
            this.dataTableValidations(data);
          }, (error) => {
            console.error(error);
          });
        });
    }
  }

  openSubdomain(subdomain) {
    var url = `http://${subdomain}`;
    window.open(url, "_blank");
  }
}

