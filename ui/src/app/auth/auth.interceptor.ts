import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        let modifiedReq;
        const headers = {
          'X-Parse-Application-Id': environment.appId,
          // 'X-Parse-REST-API-Key': environment.masterKey,
          'X-Parse-Master-Key': environment.masterKey,
          'Content-Type':  'application/json'
        };

        if (!user) {
          modifiedReq = req.clone({ setHeaders: headers });
        } else {
          modifiedReq = req.clone({
            setHeaders: {
              ...headers,
              Authorization: `${user._token}`
            }
          });
        }

        return next.handle(modifiedReq);
      })
    );
  }
}
