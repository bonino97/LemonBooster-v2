import { Validators } from '@angular/forms';
import { ProgramService } from './../../services/program.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import swal from "sweetalert2";

@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.scss']
})
export class EditProgramComponent implements OnInit {

  program:any;
  error:any;
  url:any;
  form: FormGroup;
  

  constructor(
    public route : ActivatedRoute,
    private router: Router,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({

      Name: new FormControl('', Validators.required),
      Scopes: new FormControl('', Validators.required)

    });

    this.route.params.subscribe(
      (data) => {
          this.url = data['url'];
          this.programService.GetProgram(data['url'])
          .subscribe((data) => {
            this.program = data.data;
            this.form.patchValue({
              Name: this.program.Name,
              Scopes: this.program.Scopes
            });
          }, (error) => {
            if(!error.error.success){
              this.error = error.error.msg;
            }
          });
      });
  }


  editProgram(){
    if(this.form.invalid){
      return ;
    }

    if(this.form.value.Scopes.includes(',')){
      const Scopes = [];
      const splitedScopes = this.form.value.Scopes.split(',');
  
      splitedScopes.forEach(element => {
        Scopes.push(element.trim());
      });
  
      this.form.patchValue({
        Scopes
      });
    }

    if(this.form.valid){
      this.programService.EditProgram(this.url, this.form.value)
        .subscribe((data:any) => {
          if(data.success) {
            swal.fire({
              html: `<span style='color:grey'>${data.msg}<span>`,
              timer: 1200,
              showConfirmButton: false
            }).then( () => {
              this.router.navigate([`/programs/${this.url}`]);
            });
          }
      });
    }
  }


}
