import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from 'src/app/services/program.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-cidrs',
  templateUrl: './cidrs.component.html',
  styleUrls: ['./cidrs.component.scss']
})
export class CidrsComponent implements OnInit {
  form: FormGroup;
  programUrl: any;
  program:any;
  
  constructor(
    public route : ActivatedRoute,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      CIDRs: new FormControl('')
    });
    this.route.params.subscribe(
      (data) => {
          this.programUrl = data['url'];
          this.programService.GetProgram(data['url'])
          .subscribe((data) => {
            this.program = data.data;
            this.form.patchValue({
              CIDRs: this.program.CIDRs
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
  
  searchCidrs(value){
    var url = `https://mxtoolbox.com/SuperTool.aspx?action=asn:${value}&newAppVersion=1`;
    window.open(url, "_blank");
  }

  saveCidrs(){
    var cidrArray = this.form.value.CIDRs.split(',');
    
    this.form.patchValue({
      CIDRs: cidrArray
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
                    CIDRs: this.program.CIDRs
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
