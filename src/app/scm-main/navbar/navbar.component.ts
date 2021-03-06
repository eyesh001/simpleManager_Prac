import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';


@Component({
  selector: 'scm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  appTitle = '상품 관리 시스템';
  session$: Observable<boolean>;
  sessionBtnName = '로그인';

  constructor(private afauth: AngularFireAuth) { }

  ngOnInit() {
    this.session$ = this.afauth.authState.pipe(map(user => !!user));
    this.session$.subscribe(auth => this.sessionBtnName = auth ? '로그아웃' : '로그인');
  }

  checkSession(){
    this.session$.pipe(take(1)).subscribe(s => s ? this.afauth.auth.signOut() : 
    this.afauth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()));
  }

  searchProduct(no: number) {
    console.log(`search: ${no}`);
  }
}
