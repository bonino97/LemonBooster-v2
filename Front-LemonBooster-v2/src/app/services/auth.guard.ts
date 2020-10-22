import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService) {}

  canActivate() {
    
    if(this.authService.LoggedIn()){
      return true;
    }

    this.router.navigate(['auth/login']);
    return false;
  }
}
