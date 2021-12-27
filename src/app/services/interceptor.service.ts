import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { AuthService } from './auth.service';
import { SpinnerService } from './spinner.service';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService , private auth : AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.llamarSpinner();
    if (req.url.includes('change-password')) {
      const userValue = this.auth.userValue;
      const authReq = req.clone({
        setHeaders: {
          auth: userValue.token,
        },
      });
      return next.handle(authReq);
    }
    return next.handle(req).pipe(
      finalize(() => this.spinnerService.detenerSpinner())
    );
    return next.handle(req);
  }
 
}