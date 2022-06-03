import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  Adjunto,
  Certificado,
  DatosGrafico,
  Detalle,
  Documento,
  Imagen,
  Tramite,
  TramiteDoc,
} from "../entities/tramite";
import { environment } from "src/environments/environment";
import { UserUpdate, UserResponse } from "../entities/user";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ServiciosService {
  tramites: Tramite[];
  detalles: Detalle[];
  imagenes: Imagen[];
  adjuntos: Adjunto[];
  certificados: Certificado[];
  dpies: DatosGrafico[];
  tramiteDoc: TramiteDoc[];

  constructor(private http: HttpClient, private auth: AuthService) {}

  /* **************************** SERVICIOS GESTION DOCUMENTOS **************************************** */
  getAllDocuments(): Observable<Documento[]> {
    return this.http
      .get<Documento[]>(`${environment.API_URL}/documento`)
      .pipe(catchError(this.handlerError));
  }

  deleteDocument(cod_doc): Observable<any> {
    return this.http
      .delete<any>(`${environment.API_URL}/documento`, {
        body: cod_doc,
      })
      .pipe(catchError(this.handlerError));
  }

  createDocument(documento: Documento): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/documento`, documento)
      .pipe(catchError(this.handlerError));
  }

  updateDocument(documento: Documento): Observable<any> {
    return this.http
      .patch(`${environment.API_URL}/documento`, documento)
      .pipe(catchError(this.handlerError));
  }

  /* **************************** SERVICIOS GESTION USUARIOS **************************************** */
  resetPassword(username): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/auth/reset-password`, username)
      .pipe(catchError(this.handlerError));
  }

  updateUser(user: UserUpdate): Observable<any> {
    return this.http
      .patch(`${environment.API_URL}/users`, user)
      .pipe(catchError(this.handlerError));
  }

  deleteUser(id): Observable<any> {
    console.log("id", id);
    return this.http
      .delete<any>(`${environment.API_URL}/users`, {
        body: {
          id: id,
        },
      })
      .pipe(catchError(this.handlerError));
  }

  createUser(user: UserUpdate): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/users`, user)
      .pipe(catchError(this.handlerError));
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http
      .get<UserResponse[]>(`${environment.API_URL}/users`)
      .pipe(catchError(this.handlerError));
  }
  /* **************************** SERVICIOS DASHBOARD GRAFICOS **************************************** */
  getAll(): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/grafico`, null)
      .pipe(catchError(this.handlerError));
  }

  fromEstado(tramite: string): Observable<any> {
    return this.getAll().pipe(map((data) => data[tramite]));
  }

  twoDates(tramite: string, DateFrom: Date, dateTo: Date): Observable<any> {
    return this.fromEstado(tramite).pipe(
      map((res) =>
        res.filter((val) => val.fecha >= DateFrom && val.fecha <= dateTo)
      )
    );
  }

  getAllMonth(): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/grafico/barras`, null);
  }

  fromTramiteEstado(tramite: string): Observable<any> {
    return this.getAllMonth().pipe(map((data) => data[tramite]));
  }

  twoMonths(estado: string, DateFrom: Date, dateTo: Date): Observable<any> {
    return this.fromTramiteEstado(estado).pipe(
      map((res) =>
        res.filter((val) => val.fecha >= DateFrom && val.fecha <= dateTo)
      )
    );
  }

  buscarPie(values): Observable<DatosGrafico> {
    return this.http
      .post<DatosGrafico>(`${environment.API_URL}/grafico/pie`, values)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  /* **************************** SERVICIOS TRAMITES **************************************** */
  listaTramites(): Observable<TramiteDoc[]> {
    return this.http
      .get<TramiteDoc[]>(`${environment.API_URL}/tramite`)
      .pipe(catchError(this.handlerError));
  }

  buscarTramiteDetalleDniAndId(values: any): Observable<Detalle[]> {
    return this.http
      .post<Detalle[]>(`${environment.API_URL}/tramite/tracking`, values)
      .pipe(catchError(this.handlerError));
  }

  buscarDetallesD(id_est_doc: string): Observable<Detalle[]> {
    return this.http
      .post<Detalle[]>(`${environment.API_URL}/tramite/id`, {
        id: id_est_doc,
      })
      .pipe(catchError(this.handlerError));
  }

  buscarAdjuntos(id_est_doc: string): Observable<Adjunto[]> {
    return this.http
      .post<Adjunto[]>(`${environment.API_URL}/tramite/adj`, {
        id: id_est_doc,
      })
      .pipe(catchError(this.handlerError));
  }

  buscarCertificado(id_est_doc: string): Observable<Certificado[]> {
    return this.http
      .post<Certificado[]>(`${environment.API_URL}/tramite/cer/`, {
        id: id_est_doc,
      })
      .pipe(catchError(this.handlerError));
  }

  createTramite(detalle: Detalle) {
    return this.http
      .post<any>(`${environment.API_URL}/tramite/`, detalle)
      .pipe(catchError(this.handlerError));
  }

  deleteTramite(detalle: Detalle): Observable<any> {
    return this.http
      .delete<Detalle>(`${environment.API_URL}/tramite/`, {
        body: detalle,
      })
      .pipe(catchError(this.handlerError));
  }

  deleteCertificado(certificado: Certificado): Observable<any> {
    return this.http
      .delete<Certificado>(`${environment.API_URL}/tramite/cer/`, {
        body: certificado,
      })
      .pipe(catchError(this.handlerError));
  }

  updateStatusTramite(detalle: Detalle): Observable<any> {
    return this.http
      .patch(`${environment.API_URL}/tramite`, detalle)
      .pipe(catchError(this.handlerError));
  }

  uploadFile(archivo): Observable<any> {
    console.log("SERVICIO API upload file");
    console.log(archivo);
    return this.http.post(
      `${environment.API_URL}/tramite/updatecertificado`,
      archivo
    );
  }

  /* *********************UTILITARIOS*********************** */
  handlerError(error): Observable<never> {
    let errorMessage = "Error unknown";
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    this.auth.logout();
    return throwError(() => errorMessage);
  }

  /************************ Servicios Notificacion Push *************************** */

  saveUserNotification(data): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/notificacion/suscripcion`, data)
      .pipe(catchError(this.handlerError));
  }
}
