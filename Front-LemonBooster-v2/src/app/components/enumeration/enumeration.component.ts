import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enumeration',
  templateUrl: './enumeration.component.html',
  styleUrls: ['./enumeration.component.scss']
})
export class EnumerationComponent implements OnInit {

  _subdomains: boolean = true;
  _alive: boolean = false;
  _screenshots: boolean = false;
  _jsscanner: boolean = false;
  _responseCodes: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  open(value){
    switch(value){
      case 1: 
        this._subdomains = true;
        this._alive = false;
        this._responseCodes = false;
        this._screenshots = false;
        this._jsscanner = false;
        break;
      case 2: 
        this._subdomains = false;
        this._alive = true;
        this._responseCodes = false;
        this._screenshots = false;
        this._jsscanner = false;
        break;
      case 3: 
        this._subdomains = false;
        this._alive = false;
        this._responseCodes = true;
        this._screenshots = false;
        this._jsscanner = false;
        break;
      case 4: 
        this._subdomains = false;
        this._alive = false;
        this._responseCodes = false;
        this._screenshots = true;
        this._jsscanner = false;
        break;
      case 5: 
        this._subdomains = false;
        this._alive = false;
        this._responseCodes = false;
        this._screenshots = false;
        this._jsscanner = true;
        break;
    }
  }
}
