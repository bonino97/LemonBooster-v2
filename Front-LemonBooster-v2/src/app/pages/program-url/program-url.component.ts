import { ProgramService } from './../../services/program.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-program-url',
  templateUrl: './program-url.component.html',
  styleUrls: ['./program-url.component.scss']
})
export class ProgramUrlComponent implements OnInit {

  error:any;
  program: any;

  _openSeeds: boolean = false;
  _openEnum: boolean = false;
  _openCrawl: boolean = false;

  constructor(
    public route : ActivatedRoute,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(
    (data) => {
        this.programService.GetProgram(data['url'])
        .subscribe((data) => {
          this.program = data.data;
        }, (error) => {
          if(!error.error.success){
            this.error = error.error.msg;
          }
        });
    });

  }

  open(value){
    switch(value){
      case 1: 
          this._openSeeds = true;
          this._openEnum = false;
          this._openCrawl = false;
        break;
      case 2: 
          this._openSeeds = false;
          this._openEnum = true;
          this._openCrawl = false;
        break;
      case 3: 
          this._openSeeds = false;
          this._openEnum = false;
          this._openCrawl = true;
        break;
    }
  }

}
