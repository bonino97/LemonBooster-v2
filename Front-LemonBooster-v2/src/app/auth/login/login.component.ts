import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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
    private _AuthService: AuthService,
    private router: Router
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
    if(this.loginForm.value.email === 'hackers@ekoparty.com' && this.loginForm.value.password === "WeAreSpeakers!") {
      localStorage.setItem('EkopartyAccess', 'yes');
      this.router.navigate(['programs/list']);
    }
  }


}
