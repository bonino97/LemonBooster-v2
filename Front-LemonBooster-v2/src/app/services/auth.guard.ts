import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router) {}

  canLoad() {
    if(localStorage.getItem('EkopartyAccess') === 'yes'){
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

  canActivate() {
    
    if(localStorage.getItem('EkopartyAccess') === 'yes'){
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}
