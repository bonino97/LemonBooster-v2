import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enumeration',
  templateUrl: './enumeration.component.html',
  styleUrls: ['./enumeration.component.scss']
})
export class EnumerationComponent implements OnInit {

  _subdomains: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  open(value){
    switch(value){
      case 1: 
          
        break;
      case 2: 

        break;
      case 3: 

        break;
      case 4: 

        break;
    }
  }
}
