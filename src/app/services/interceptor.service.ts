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
  // Servicio para interceptar llamas HTTP para llamar al spinner de carga asi como envio de token en las cabeceras
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.llamarSpinner();
    if (req.url.includes('change-password')) {
      const userValue = this.auth.userValue;
      const authReq = req.clone({
        setHeaders: {
          auth: userValue.token,
        },
      });
      this.spinnerService.detenerSpinner();
      return next.handle(authReq);
    }
    return next.handle(req).pipe(
     finalize(() => this.spinnerService.detenerSpinner())
    );
    return next.handle(req);
  }
 
}