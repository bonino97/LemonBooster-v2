import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from "./password-validator";
import { User } from '../../models/user.models';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import swal from "sweetalert2";

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

  loading = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");

    this.registerForm = this.formBuilder.group(
      {
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
    this.loading = true;
    if (this.registerForm.invalid) return;
    const user = new User(
      this.registerForm.value.email,
      this.registerForm.value.password
    );
    this.authService.Register(user)
    .subscribe((data:any) => {
      swal.fire({
        html: `<span style='color: gray;'>${data.msg}&nbsp;<i class="fas fa-check"></i><span>`,
        timer: 5000,
        showConfirmButton: false
      });
      this.registerForm.reset();
      this.loading = false;
    }, (error:any) => {
      swal.fire({
        html: `<span style='color:#ff8d72'>${error.error.msg}&nbsp;<i class="fas fa-times"></i><span>`,
        timer: 5000,
        showConfirmButton: false
      });
      this.loading = false;
    });
  }
}
