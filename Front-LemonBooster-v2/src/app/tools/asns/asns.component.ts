import { ProgramService } from './../../services/program.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";

@Component({
  selector: 'app-asns',
  templateUrl: './asns.component.html',
  styleUrls: ['./asns.component.scss']
})
export class AsnsComponent implements OnInit {

  form: FormGroup;
  programUrl: any;
  program:any;
  
  constructor(
    public route : ActivatedRoute,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      ASNs: new FormControl('')
    });
    this.route.params.subscribe(
      (data) => {
          this.programUrl = data['url'];
          this.programService.GetProgram(data['url'])
          .subscribe((data) => {
            this.program = data.data;
            this.form.patchValue({
              ASNs: this.program.ASNs
            });
          }, (error) => {
            if(!error.error.success){
              swal.fire({
                html: `<span style='color:grey'>${error.error.msg}<span>`,
                timer: 1200,
                showConfirmButton: false
              });
            }
          });
      });
  }

  searchAsns(value){
    
    var url = `https://bgp.he.net/search?search%5Bsearch%5D=${value}&commit=Search`;
    window.open(url, "_blank");
  }

  saveAsns(){

    var asnArray = this.form.value.ASNs.split(',');
    
    this.form.patchValue({
      ASNs: asnArray
    });

    this.route.params.subscribe(
      (data) => {
        this.programUrl = data['url'];
        this.programService.EditProgram(data['url'], this.form.value)
        .subscribe((data:any) => {
          if(data.success) {
            swal.fire({
              html: `<span style='color:grey'>${data.msg}<span>`,
              timer: 1200,
              showConfirmButton: false
            }).then( () => {
              this.programService.GetProgram(this.programUrl)
                .subscribe((data:any) => {
                  this.program = data.data;
                  this.form.patchValue({
                    ASNs: this.program.ASNs
                  });
              });
            });
          }
      }, (error) => {
        if(!error.error.success){
          swal.fire({
            html: `<span style='color:grey'>${error.error.msg}<span>`,
            timer: 1200,
            showConfirmButton: false
          });
        }
      });
      })
    
  }

}
