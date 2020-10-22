import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import swal from "sweetalert2";

@Component({
  selector: "app-confirm-account",
  templateUrl: "./confirm-account.component.html",
  styleUrls: ["./confirm-account.component.scss"],
})
export class ConfirmAccountComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  confirmAccount() {
    this.route.params.subscribe((params) => {
      let url = {
        Url: params["url"],
      };
      this.authService.ConfirmAccount(url).subscribe(
        (data: any) => {
          swal.fire({
            html: `<span style='color: gray;'>${data.msg}&nbsp;<i class="fas fa-check"></i><span>`,
            timer: 5000,
            showConfirmButton: false,
          });
          this.router.navigate(["auth/login"]);
        },
        (error: any) => {
          swal.fire({
            html: `<span style='color:#ff8d72'>${error.error.msg}&nbsp;<i class="fas fa-times"></i><span>`,
            timer: 5000,
            showConfirmButton: false,
          });
        }
      );
    });
  }
}
