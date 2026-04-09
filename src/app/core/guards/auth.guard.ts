import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { storageConst } from '@app/shared/common';
import { BaseService } from '@app/shared/services/baseService.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router, private baseService: BaseService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userProfile = this.baseService.getJSONData(storageConst.userProfile);
    
    // If user is authenticated, allow access
    if (userProfile && userProfile.systemUserId !== undefined && userProfile.systemUserId > 0) {
      return true;
    }
    
    // If not authenticated, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}


