import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from "./password-validator";
import { User } from '../../models/user.models';
import { Router } from '@angular/router';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  focus;
  focus1;
  focus2;
  focus3;
  focus4;

  public focusTouched;
  public focusTouched1;
  public focusTouched2;
  public focusTouched3;
  public focusTouched4;

  public registerForm: FormGroup;
  public register = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");

    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        repeatPassword: ["", [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: MustMatch("password", "repeatPassword"),
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    const user = new User(
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.firstName,
      this.registerForm.value.lastName
    );
  
  }
}
