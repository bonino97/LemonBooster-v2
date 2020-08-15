import { Component, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/services/program.service';
import { ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-acquisitions',
  templateUrl: './acquisitions.component.html',
  styleUrls: ['./acquisitions.component.scss']
})
export class AcquisitionsComponent implements OnInit {

  form: FormGroup;
  programUrl: any;
  program:any;

  constructor(
    public route : ActivatedRoute,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      Acquisitions: new FormControl('')
    });
    this.route.params.subscribe(
      (data) => {
          this.programUrl = data['url'];
          this.programService.GetProgram(data['url'])
          .subscribe((data) => {
            this.program = data.data;
            this.form.patchValue({
              Acquisitions: this.program.Acquisitions
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

  searchAcquisition(acquisition){
    var url = `https://www.crunchbase.com/textsearch?q=${acquisition}`;
    window.open(url, "_blank");
  }

  saveAcquisitions(){

    var acqArray = this.form.value.Acquisitions.split(',');
    
    this.form.patchValue({
      Acquisitions: acqArray
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
                    Acquisitions: this.program.Acquisitions
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
