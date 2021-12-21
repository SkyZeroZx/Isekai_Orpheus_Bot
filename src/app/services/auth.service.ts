import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User, UserResponse } from '../entities/user';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkToken();
   }

   get isLogged():Observable<boolean> {
      return this.loggedIn.asObservable();
   }

  login(authData:User): Observable<UserResponse |void> {
    return this.http.post<UserResponse>(`${environment.API_URL}/auth/login`,authData).pipe(
      map((res:UserResponse)=>{
        console.log('Res->',res);
        this.saveToken(res.token)
        this.loggedIn.next(true);
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }


  logout():void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  private checkToken():void {
    const userToken = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(userToken);
    console.log('isExpired - >' , isExpired);
    
    isExpired ? this.logout() : this.loggedIn.next(true);
  }

  private saveToken(token:string):void {
    localStorage.setItem('token',token);
  }

  private handlerError(err):Observable <never> {
    let errorMessage='An error ocurred retrieving data';
    if(err){
      errorMessage:`Error: code ${err.message}`
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }




}
