import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seeds',
  templateUrl: './seeds.component.html',
  styleUrls: ['./seeds.component.scss']
})
export class SeedsComponent implements OnInit {

  _acquisitions: boolean = true;
  _asns: boolean = false;
  _cidrs: boolean = false;
  _amass: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  open(value){
    switch(value){
      case 1: 
          this._acquisitions = true;
          this._asns = false;
          this._cidrs = false;
          this._amass = false;
        break;
      case 2: 
          this._acquisitions = false;
          this._asns = true;
          this._cidrs = false;
          this._amass = false;
        break;
      case 3: 
          this._acquisitions = false;
          this._asns = false;
          this._cidrs = true;
          this._amass = false;
        break;
      case 4: 
        this._acquisitions = false;
        this._asns = false;
        this._cidrs = false;
        this._amass = true;
        break;
    }
  }

}
