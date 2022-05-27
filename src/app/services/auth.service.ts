import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "src/environments/environment";
import {
  ChangePassword,
  ChangePasswordRes,
  UserLogin,
  UserResponse,
} from "../entities/user";
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Servicio de autenticacion
  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<UserResponse>(null);

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  get user$(): Observable<UserResponse> {
    return this.user.asObservable();
  }

  get userValue(): UserResponse {
    return this.user.getValue();
  }

  login(authData: UserLogin): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`${environment.API_URL}/auth/login`, authData)
      .pipe(
        map((user: UserResponse) => {
          this.saveLocalStorage(user);
          this.user.next(user);
          return user;
        })
      );
  }

  changePassword(authPassword: ChangePassword): Observable<ChangePasswordRes> {
    return this.http
      .post<ChangePasswordRes>(
        `${environment.API_URL}/auth/change-password`,
        authPassword
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  logout(): void {
    localStorage.removeItem("user");
    localStorage.clear();
    this.user.next(null);
    this.loggedIn.next(false);
  }

  getItemToken(item:string){
    return helper.decodeToken(JSON.parse(localStorage.getItem("user")).token)[item];
  }


  private checkToken(): void {
    const user = JSON.parse(localStorage.getItem("user")) || null;

    if (user) {
      const isExpired = helper.isTokenExpired(user.token);
      if (isExpired) {
        this.logout();
      } else {
        this.user.next(user);
      }
    }
  }

  private saveLocalStorage(user: UserResponse): void {
    const { userId, message,role, ...rest } = user;
    localStorage.setItem("user", JSON.stringify(rest));
  }


  private handlerError(err): Observable<never> {
    let errorMessage = "An errror occured retrienving data";
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    window.alert(errorMessage);
    this.logout();
    return throwError(() => errorMessage);
  }
}
