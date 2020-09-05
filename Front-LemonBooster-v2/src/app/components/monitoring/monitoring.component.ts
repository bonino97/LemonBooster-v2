import { Component, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/services/program.service';
import { ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {

  page = 1;
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

  results: any;

  scopes: any[] = [];

  scopeList:any[] = [];

  typeList: any[] = [
    { id: 1, itemName: 'Subdomains' },
    { id: 2, itemName: 'Alives'},
    { id: 5, itemName: 'Responses Codes'},
    { id: 6, itemName: 'Waybackurls'},
    { id: 8, itemName: 'GoSpider'},
    { id: 10, itemName: 'Hakrawler'},
    { id: 12, itemName: 'Dirsearch'},
  ];

  scope: any;
  type:any;

  newDate: any;
  startDate: Date = new Date();
  endDate: Date = new Date();

  url:any;

  constructor(
    public programService: ProgramService,
    public toolService:ToolsService,
    public route : ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (data) => {
        this.url = data['url'];
        this.programService.GetProgram(data['url']).subscribe(
        (data:any) => {
          this.scopes = data.data.Scopes;
          this.scopes.forEach( (elem, i) => {
            let list = {
              id: i,
              itemName: elem
            }
            this.scopeList.push(list);
          });
        });
      })
  }

  selectedScope(scope){
    this.scope = scope.itemName;
  }

  selectedType(type){
    this.type = type.id;
  }

  onDate(date){
    this.startDate = date[0];
    this.endDate = date[1];
  }

  searchMonitoringInstances(){


    if(this.startDate > new Date()){
      swal.fire({
        html: `<span style='color:grey'> Select correct daterange... <span>`,
        timer: 3500,
        showConfirmButton: false
      });
    }

    if(this.scope === undefined) {
      swal.fire({
        html: `<span style='color:grey'> Select Scope to view new results... <span>`,
        timer: 3500,
        showConfirmButton: false
      });
      return;
    }

    if(this.type === undefined) {
      swal.fire({
        html: `<span style='color:grey'> Select Type of Monitoring to view new results... <span>`,
        timer: 3500,
        showConfirmButton: false
      });
      return;
    }

    this.toolService.GetMonitoringResults(this.url, this.scope, this.type, this.page, this.limit, this.startDate.toISOString(), this.endDate.toISOString(), this.filter)
      .subscribe((data:any) => {
        this.dataTableValidations(data);
      }, (error) => {
        swal.fire({
          html: `<span style='color:grey'>${error.error.msg}<span>`,
          timer: 1500,
          showConfirmButton: false
        });
      });
    
  }

  next(){ //Pagina Siguiente
    this.toolService.GetMonitoringResults(this.url, this.scope, this.type, this.nextPage, this.limit, this.startDate.toISOString(), this.endDate.toISOString(), this.filter)
    .subscribe(data => {
      this.dataTableValidations(data);
    }, (error) => {
      swal.fire({
        html: `<span style='color:grey'>${error.error.msg}<span>`,
        timer: 1500,
        showConfirmButton: false
      });
    });
  }

  previous(){ //Pagina Previa
    
    this.toolService.GetMonitoringResults(this.url, this.scope, this.type, this.previousPage, this.limit, this.startDate.toISOString(), this.endDate.toISOString(), this.filter)
    .subscribe(data => {
      this.dataTableValidations(data);
    }, (error) => {
      swal.fire({
        html: `<span style='color:grey'>${error.error.msg}<span>`,
        timer: 1500,
        showConfirmButton: false
      });
    });

  }

  nextFive(){

    this.toolService.GetMonitoringResults(this.url, this.scope, this.type, this.actualPage+5, this.limit, this.startDate.toISOString(), this.endDate.toISOString(), this.filter)
    .subscribe(data => {
      this.dataTableValidations(data);
    }, (error) => {
      swal.fire({
        html: `<span style='color:grey'>${error.error.msg}<span>`,
        timer: 1500,
        showConfirmButton: false
      });
    });

  }

  previousFive(){

    this.toolService.GetMonitoringResults(this.url, this.scope, this.type, this.actualPage-5, this.limit, this.startDate.toISOString(), this.endDate.toISOString(), this.filter)
    .subscribe(data => {
      this.dataTableValidations(data);
    }, (error) => {
      swal.fire({
        html: `<span style='color:grey'>${error.error.msg}<span>`,
        timer: 1500,
        showConfirmButton: false
      });
    });

  }

  dataTableValidations(data){
    this.totalPages = data.totalPages;
    this.results = [];
    this.results = data.results;
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

    this.toolService.GetMonitoringResults(this.url, this.scope, this.type, this.actualPage, this.limit, this.startDate.toISOString(), this.endDate.toISOString(), this.filter)
    .subscribe(data => {
      this.dataTableValidations(data);
    }, (error) => {
      swal.fire({
        html: `<span style='color:grey'>${error.error.msg}<span>`,
        timer: 1500,
        showConfirmButton: false
      });
    });

  }

  filterTable($event) {
    this.filter = $event.target.value;
    if ($event.keyCode === 13) {
      this.toolService.GetMonitoringResults(this.url, this.scope, this.type, this.actualPage, this.limit, this.startDate.toISOString(), this.endDate.toISOString(), this.filter)
      .subscribe(data => {
        this.dataTableValidations(data);
      }, (error) => {
        swal.fire({
          html: `<span style='color:grey'>${error.error.msg}<span>`,
          timer: 1500,
          showConfirmButton: false
        });
      });
    }
  }

  openSubdomain(subdomain) {
    var url = `http://${subdomain}`;
    window.open(url, "_blank");
  }

  openAlive(alive) {
    window.open(alive, "_blank");
  }


}
