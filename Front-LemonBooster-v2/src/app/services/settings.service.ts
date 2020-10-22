import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { Setting } from "../models/setting.model";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  url = environment.authUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  AddSetting(setting: Setting): Observable<any> {
    let params = JSON.stringify(setting);
    let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", `Bearer ${this.authService.GetToken()}`);

    return this.http.post(`${this.url}/settings/add-settings`, params, {
      headers: headers,
    });
  }
  
  GetSetting(): Observable<any> {
    let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", `Bearer ${this.authService.GetToken()}`);

    return this.http.get(`${this.url}/settings`, {headers: headers});
  }
}
