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

        if (!user) {
          modifiedReq = req.clone({
            setHeaders: {
              'X-Parse-Application-Id': environment.appId
            }
          });
        } else {
          modifiedReq = req.clone({
            setHeaders: {
              Authorization: `${user._token}`,
              'X-Parse-Application-Id': environment.appId
            }
          });
        }

        return next.handle(modifiedReq);
      })
    );
  }
}
