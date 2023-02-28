import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthResponseInterface } from '../interfaces/AuthResponseInterface';
import { BehaviorSubject, throwError } from 'rxjs';
import { UserInterface } from '../interfaces/UserInterface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  user = new BehaviorSubject<UserInterface | null>(null);

  login(username: string, password: string) {
    return this.http.post<AuthResponseInterface>(environment.loginUrl,
      {
        username: username,
        password: password
      }).pipe(
        catchError(this.handleError),
        tap(user => this.storeUserDate(user))
      );
  };

  autoLogin() {
    try {
      const serializedUser = localStorage.getItem('currentUser');

      if (serializedUser) {
        // Deserialize the user object and pass it afterwards as global value
        const user = JSON.parse(serializedUser);
        this.user.next(user);
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
          localStorage.removeItem('currentUser');

          this.router.navigate(['/']);
        })
      );
  };

  private storeUserDate(user: UserInterface) {
    const serializedUser = JSON.stringify(user);
    // Store the serialized user object in local storage
    localStorage.setItem('currentUser', serializedUser);

    this.user.next(user);
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
