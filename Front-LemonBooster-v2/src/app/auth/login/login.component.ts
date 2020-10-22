import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  focus;
  focus1;

  public loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");

    this.loginForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]]
      });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(){
    var token = '';
    if (this.loginForm.invalid) return;
    const user = new User(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.authService.Login(user)
    .subscribe((data:any) => {
      token = data.token;
      localStorage.setItem('LemonToken', token);
      this.router.navigate(['programs/list']);
    }, (error:any) => {
      console.error(error);
      swal.fire({
        html: `<span style='color:#ff8d72'>${error.error.msg}&nbsp;<i class="fas fa-times"></i><span>`,
        timer: 5000,
        showConfirmButton: false
      });
    });
  }
}
