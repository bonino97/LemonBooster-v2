import { Component, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/services/program.service';
import { Socket } from 'ngx-socket-io';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-directory-bruteforce',
  templateUrl: './directory-bruteforce.component.html',
  styleUrls: ['./directory-bruteforce.component.scss']
})
export class DirectoryBruteforceComponent implements OnInit {

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

  alives: any;
  alive: any;

  responseCodeSubdomain: any;
  responseCodeSubdomains: any;

  statusCode:any;
  subdomain: any;

  scope: any;
  

  program:any;

  socketStatus: boolean = false;
  executing: boolean = false;

  dirsearchLists: any[] = [];

  selectedList: any;

  form: FormGroup;

  constructor(
    public route : ActivatedRoute,
    public toolService:ToolsService,
    public socket: Socket,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      SelectedList: new FormControl('', Validators.required)
    });

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

    this.toolService.GetExecutedDirsearch()
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

    this.route.params.subscribe(
      (data) => {
        this.toolService.GetDirsearchLists(data['url']).subscribe(data =>  {
          this.dirsearchLists = data.data;
        }, (error) => {
          console.error('Error Getting Dirsearch Lists: ', error);
        })
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

  getScopeResultFile(scope) {
    this.scope = scope;
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetDirsearchResults(data['url'], scope)
        .subscribe(data => {
          var file = data.data.File.split('LemonBooster-Results/');
          var url = `http://${localStorage.getItem('IpVPS')}:5000/Static/${file[1]}`;
          window.open(url, "_blank");

        }, (error) => {
          console.error(error);
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 1500,
            showConfirmButton: false
          });
        });
      });
  }

  getScopeResultFileBySubdomain(subdomain) {
    this.route.params.subscribe(
      (data) => {
        this.toolService.GetDirsearchResultsBySubdomain(data['url'], this.scope, subdomain)
        .subscribe(data => {
          var file = data.data.File.split('LemonBooster-Results/');
          var url = `http://${localStorage.getItem('IpVPS')}:5000/Static/${file[1]}`;
          window.open(url, "_blank");

        }, (error) => {
          console.error(error);
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 1500,
            showConfirmButton: false
          });
        });
      });
  }

  executeAllDirsearch(scope){
    if(this.selectedList !== undefined) {
      this.route.params.subscribe(
        (data) => {
          this.scope = scope;
          let Scope = {
            Scope: this.scope
          }
  
          this.toolService.ExecuteAllDirsearch(data['url'], Scope)
            .subscribe((data:any) => {
              this.executing = true;
  
              var Payload = {
                Alives: data.alives,
                Dirsearch: data.data,
                List: this.selectedList
              }
              
              this.toolService.WsExecuteAllDirsearch(Payload); // Ejecuto herramienta.
  
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
    else {
      swal.fire({
        html: `<span style='color:grey'> Select a list to execute bruteforcing! <span>`,
        timer: 2500,
        showConfirmButton: false
      });
    }
  }

  executeDirsearchBySubdomain(alive) {

    if(this.selectedList !== undefined) {
      this.route.params.subscribe(
        (data) => {
  
          let Params = {
            Scope: this.scope,
            Subdomain: alive
          }
  
          this.toolService.ExecuteDirsearchBySubdomain(data['url'], Params)
            .subscribe((data:any) => {
  
              this.executing = true;
  
              var Payload = {
                Dirsearch: data.data,
                List: this.selectedList
              }            
              console.log(Payload);
              this.toolService.WsExecuteDirsearchBySubdomain(Payload); // Ejecuto herramienta.
  
            }, (error) => {
              console.error(error);
              swal.fire({
                html: `<span style='color:grey'>${error.error.msg}<span>`,
                timer: 2500,
                showConfirmButton: false
              });
            });
        });
    } else {
      swal.fire({
        html: `<span style='color:grey'> Select a list to execute bruteforcing! <span>`,
        timer: 2500,
        showConfirmButton: false
      });
    }
  }

  getResponseCodesSubdomains(scope){
    this.scope = scope;
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetAlivesByScope(data['url'], 1, 5, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
        });
      });
  }

  next(){ //Pagina Siguiente
    
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetAlivesByScope(data['url'], this.nextPage, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
        });
      });
  }

  previous(){ //Pagina Previa
    
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetAlivesByScope(data['url'], this.previousPage, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
        });
      });
  }

  nextFive(){
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetAlivesByScope(data['url'], this.actualPage+5, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
        });
      });
  }

  previousFive(){
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetAlivesByScope(data['url'], (this.actualPage-5), this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
        });
      });
  }

  entriesChange($event) {
    this.limit = $event.target.value;
    this.route.params.subscribe(
      (data) => { 
        this.toolService.GetAlivesByScope(data['url'], this.actualPage, this.limit, this.scope, this.filter)
        .subscribe(data => {
          this.dataTableValidations(data);
        }, (error) => {
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 2500,
            showConfirmButton: false
          });
        });
      });
  }

  filterTable($event) {
    this.filter = $event.target.value;
    if ($event.keyCode === 13) {
      this.route.params.subscribe(
        (data) => { 
          this.toolService.GetAlivesByScope(data['url'], this.actualPage, this.limit, this.scope, this.filter)
          .subscribe(data => {
            this.dataTableValidations(data);
          }, (error) => {
            swal.fire({
              html: `<span style='color:grey'>${error.error.msg}<span>`,
              timer: 2500,
              showConfirmButton: false
            });
          });
        });
    }
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

  captureList(){
    this.selectedList = this.form.value.SelectedList;
    return this.selectedList;
  }
  
}
