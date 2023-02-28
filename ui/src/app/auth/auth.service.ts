import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthResponse } from './responseInterface';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  user = new BehaviorSubject<User | null>(null);

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(environment.loginUrl,
      {
        username: username,
        password: password
      }).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.username, resData.email, resData.sessionToken, resData.objectId);
        })
      );
  };

  autoLogin() {
    try {
      const user: User = JSON.parse(localStorage.getItem('userData') || '{}');

      if (Object.keys(user).length !== 0) {
        const initiatedUser = new User(user.username, user.email, user._token, user.id);
        this.user.next(initiatedUser);
      }      
    } catch (error) {
      console.log('No local user exists')
    }
  };

  logOut() {
    return this.http.post(environment.logOut, {})
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.user.next(null);
          localStorage.removeItem('userData');
          this.router.navigate(['/']);
        })
      );
  };

  private handleAuthentication(username: string, email: string, sessionToken: string, objectId: string) {
    const user = new User(username, email, sessionToken, objectId);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  };

  private handleError(errorRes: HttpErrorResponse) {
    const errorMessage = 'An unknown error occurred!';
    
    if (errorRes.error.message !== 'Invalid username/password.') {
      return throwError(errorMessage);
    } else {
      return throwError(errorRes.error.message);
    }
  };
}
