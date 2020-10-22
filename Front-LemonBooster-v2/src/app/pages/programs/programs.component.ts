import { ProgramService } from './../../services/program.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from "sweetalert2";
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {
  programs:any[] = [];
  error: any;
  executing = false;
  socketStatus: boolean = true;

  constructor(
    public programService: ProgramService,
    private router: Router,
    public socket: Socket,) { }

  ngOnInit(): void {
    this.executing = true;
    this.checkStatus();
    this.programService.GetPrograms().subscribe((data:any) => {
      this.programs = data.data;  
      this.executing = false;
    }, (error:any) => {
      this.executing = false;
      if(!error.error.success && error.status === 404){
        this.error = error.error.msg;
      }
      console.error(error);
    });
  }

  removeProgram(id){

    swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger btn-simple btn-sm",
      confirmButtonClass: "btn btn-success btn-simple btn-sm",
      confirmButtonText: `<b><i class="tim-icons icon-check-2 font-weight-bold"></i></b>`,
      cancelButtonText: `<b><i class="tim-icons icon-simple-remove font-weight-bold"></i></b>`,
      buttonsStyling: false,
      background: '#ffffff'

    }).then( (result) => {
      if(result.value) {
        this.programService.RemoveProgram(id).subscribe((data:any) => {
          swal.fire({
            html: `<span style='color:grey'>${data.msg}<span>`,
            timer: 1200,
            showConfirmButton: false
          }).then( () => {
              this.programService.GetPrograms().subscribe(
              (data:any) => {
                this.programs = data.data;  
              }, (error:any) => {
                this.programs = [];
                if(!error.error.success && error.status === 404){
                  this.error = error.error.msg;
                }
                console.error(error);
              });
          });
        }, (error:any) => {
          if(!error.error.success && error.status === 404){
            this.error = error.error.msg;
          }
          console.error(error);
        });
      }
    })
  }

  checkStatus(){
    
    this.socket.on('connect', () => {
      console.log('Connected to Server.');
      this.socketStatus = true;
      this.executing = false;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Server.');
      this.socketStatus = false;
      this.executing = true;
    });
  }

}
