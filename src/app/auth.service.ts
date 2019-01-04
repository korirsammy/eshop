import { UserService } from './user.service';
import { AppUser } from './models/app-user';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of'; 
import * as firebase from 'firebase'; 


import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';





@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable< firebase.User>;
  
  constructor(
    private userService: UserService,
    public afAuth:AngularFireAuth, private route:ActivatedRoute) { 
    this.user$= this.afAuth.authState;
  }

  login() { 
    let returnUrl=this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl',returnUrl);
    
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider);
  }
  logout(){
    this.afAuth.auth.signOut();
  }
  get appUser$() : Observable<AppUser> {
    return this.user$
      .pipe(switchMap(user => {
        if (user) return this.userService.get(user.uid);

        return Observable.of(null);
      }));    
  }
}
