import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Adjunto, Certificado, Contador, DatosGrafico, Detalle, Imagen, Tramite, TramiteDoc } from "../entities/tramite";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ServiciosService {

  tramites: Tramite[];
  detalles: Detalle[];
  imagenes: Imagen[];
  adjuntos : Adjunto[];
  certificados : Certificado[];
  dpies: DatosGrafico[];
  tramiteDoc :TramiteDoc[];
  
  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/grafico`,null)
    .pipe(catchError(this.handlerError));
  }

  public fromEstado(tramite: string): Observable<any> {
    return this.getAll().pipe(map((data) => data[tramite]));
  }

  public twoDates(tramite: string,DateFrom: Date,dateTo: Date): Observable<any> {
    return this.fromEstado(tramite).pipe(
      map((res) =>
        res.filter(
          (val) =>
            new Date(val.fecha) >= DateFrom && new Date(val.fecha) <= dateTo
        )
      )
    );
  }

  public getAllMonth(): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/grafico/barras`,null)
  }

  public fromTramiteEstado(tramite: string): Observable<any> {
    return this.getAllMonth().pipe(map((data) => data[tramite]));
  }

  twoMonths( estado: string,DateFrom: Date,dateTo: Date): Observable<any> {
    return this.fromTramiteEstado(estado).pipe(
      map((res) =>
        res.filter((val) => val.fecha >= DateFrom && val.fecha <= dateTo)
      )
    );
  }


  buscarPie(values): Observable<DatosGrafico> {
    return this.http.post<DatosGrafico>(`${environment.API_URL}/grafico/pie`, values).pipe(
      map((res) => {
        console.log('BuscarPIE', res);
        
    //    this.dpies = JSON.parse(JSON.stringify(res));
    //    console.log('dPIE es ', this.dpies);
        return res;
      })
    );
  }

  listaTramites(): Observable<TramiteDoc[]> {
    return this.http
      .get<TramiteDoc[]>(`${environment.API_URL}/tramite`)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error): Observable<never> {
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


  buscarDetallesD(id_est_doc: string): Observable<Detalle[]> {
    return this.http
      .get<Detalle[]>(`${environment.API_URL}/tramite/${id_est_doc}`)
      .pipe(catchError(this.handlerError));
  }

  buscarImagenes(id_est_doc: string): Observable<Imagen[]>{
    return this.http
      .get<Imagen[]>(`${environment.API_URL}/tramite/img/${id_est_doc}`)
      .pipe(catchError(this.handlerError));
   }

  buscarAdjuntos(id_est_doc: string): Observable<Adjunto[]>{
    return this.http
      .get<Adjunto[]>(`${environment.API_URL}/tramite/adj/${id_est_doc}`)
      .pipe(catchError(this.handlerError));
   }

   buscarCertificado(id_est_doc: string): Observable<Certificado[]>{
    return this.http
      .get<Certificado[]>(`${environment.API_URL}/tramite/cer/${id_est_doc}`)
      .pipe(catchError(this.handlerError));
   }

  insertarTramite(detalle : Detalle) {
   return this.http.post<any>(`${environment.API_URL}/tramite/`, detalle)
   .pipe(catchError(this.handlerError));;
  }

  deleteTramite(detalle : Detalle ): Observable<{}> {
    return this.http.delete<Detalle>(`${environment.API_URL}/tramite/`, {
      body:detalle
    })
    .pipe(catchError(this.handlerError));;
  }

  deleteCertificado(certificado : Certificado ): Observable<{}> {
    return this.http.delete<Certificado>(`${environment.API_URL}/tramite/cer/`, {
      body:certificado
    })
    .pipe(catchError(this.handlerError));;
  }

  update(detalle: Detalle) {
    return this.http
      .patch(`${environment.API_URL}/tramite`, detalle)
      .pipe(catchError(this.handlerError));
  }
 
  uploadFile(archivo) {
    console.log('SERVICIO API upload file')
    console.log(archivo)
    return this.http.post(`${environment.API_URL}/tramite/updatecertificado`, archivo);
  }
 


}
