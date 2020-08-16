import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enumeration',
  templateUrl: './enumeration.component.html',
  styleUrls: ['./enumeration.component.scss']
})
export class EnumerationComponent implements OnInit {

  _subdomains: boolean = true;
  _alive: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  open(value){
    switch(value){
      case 1: 
        this._subdomains = true;
        this._alive = false;
        break;
      case 2: 
        this._subdomains = false;
        this._alive = true;
        break;
      case 3: 

        break;
      case 4: 

        break;
    }
  }
}
