import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { take, tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SessionAuthGuardService {
  constructor(
    private router: Router,
   // private toastr: ToastsManager,
    private afAuth: AngularFireAuth) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.afAuth.authState.pipe(
      take(1)
      , map(user => !!user)
      , tap(authenticated => {
        if (!authenticated) {
         // this.toastr.error('로그인 해주세요', '[오류]');
          this.router.navigate(['/']);
        }
      }));
  }
}
