import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { Setting } from "../../models/setting.model";
import { SettingsService } from "../../services/settings.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(private settingService: SettingsService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      IpVPS: new FormControl("", Validators.required),
    });

    this.settingService.GetSetting()
      .subscribe((data: any) => {
        this.formControls.IpVPS.setValue(data.data.IpVPS);
      }, (err:any) => {
        console.error(err);
      });
  }

  get formControls() {
    return this.form.controls;
  }

  addSettings() {
    this.loading = true;

    if (this.form.invalid) return;

    const setting = new Setting(this.form.value.IpVPS);

    this.settingService.AddSetting(setting).subscribe(
      (data: any) => {
        swal.fire({
          html: `<span style='color: gray;'>${data.msg}&nbsp;<i class="fas fa-check"></i><span>`,
          timer: 5000,
          showConfirmButton: false,
        });
        this.formControls.IpVPS.setValue(data.data.IpVPS);
        localStorage.setItem('IpVPS', data.data.IpVPS);
        this.loading = false;
        location.reload();
      },
      (error: any) => {
        swal.fire({
          html: `<span style='color:#ff8d72'>${error.error.msg}&nbsp;<i class="fas fa-times"></i><span>`,
          timer: 5000,
          showConfirmButton: false,
        });
        this.loading = false;
      }
    );
  }
}
