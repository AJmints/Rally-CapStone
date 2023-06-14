import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, 
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class JwtHandlerInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    /* This is needed to login/register and view the site */
    const jwt = this.cookieService.get('token');
    if (jwt === null) {
      request = request.clone({
        withCredentials: true,
      });
      return next.handle(request);
    }

    /* If the user holds a JWT token, this will send it in the headers to the back end for verification */
    request = request.clone({
      withCredentials: true,
      setHeaders: { authorization: `Bearer ${jwt}`}
    });

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtHandlerInterceptor, multi: true},
]
