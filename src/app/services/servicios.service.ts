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
  ruta = "https://cameronian-treatmen.000webhostapp.com/angular/prueba.php";
  u="https://cameronian-treatmen.000webhostapp.com/angular/"
  rutab = "https://cameronian-treatmen.000webhostapp.com/angular/barras.php";

  tramites: Tramite[];
  detalles: Detalle[];
  imagenes: Imagen[];
  adjuntos : Adjunto[];
  certificados : Certificado[];
  dpies: DatosGrafico[];
  tramiteDoc :TramiteDoc[];
  
  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    return this.http.get<any>(this.ruta);
  }

  public fromEstado(country: string): Observable<any> {
    return this.getAll().pipe(map((data) => data[country]));
  }

  public twoDates(estado: string,DateFrom: Date,dateTo: Date): Observable<any> {
    return this.fromEstado(estado).pipe(
      map((res) =>
        res.filter(
          (val) =>
            new Date(val.fecha) >= DateFrom && new Date(val.fecha) <= dateTo
        )
      )
    );
  }

  public getAllMonth(): Observable<any> {
    return this.http.get<any>(this.rutab);
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


  buscarPie(estado, DateFrom, dateTo): Observable<DatosGrafico[]> {
    const ruta =
      "https://cameronian-treatmen.000webhostapp.com/angular/pie.php";
    const formData: FormData = new FormData();
    formData.append("ESTADO", estado);
    formData.append("INICIO", DateFrom);
    formData.append("FIN", dateTo);
    return this.http.post<DatosGrafico[]>(ruta, formData).pipe(
      map((res) => {
        this.dpies = JSON.parse(JSON.stringify(res));
        return this.dpies;
      })
    );
  }

 /* listaTramites(): Observable<TramiteDoc[]>{
 const ruta ="https://cameronian-treatmen.000webhostapp.com/angular/servicio_tramite.php" post
    return this.http.post<TramiteDoc[]>(ruta,null).pipe(
       map((res) => {
         this.tramiteDoc = JSON.parse(JSON.stringify(res));
         return this.tramiteDoc;
       })
     )
   }*/

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

 /*  buscarDetallesD(ID_EST_DOC): Observable<Detalle[]>{
    const ruta = "https://cameronian-treatmen.000webhostapp.com/angular/servicio_detalled.php";
    const formData: FormData = new FormData();
    formData.append("caty",ID_EST_DOC);
    return this.http.post<Detalle[]>(ruta,formData).pipe(
      map((res) => {
        this.detalles = JSON.parse(JSON.stringify(res));
        return this.detalles;
      })
    )
  }*/
  buscarImagenes(id_est_doc: string): Observable<Imagen[]>{
    return this.http
      .get<Imagen[]>(`${environment.API_URL}/tramite/img/${id_est_doc}`)
      .pipe(catchError(this.handlerError));
   }

 /* buscarImagenes(ID_EST_DOC): Observable<Imagen[]>{
    const ruta =this.u+"busca_imagen.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    return this.http.post<Imagen[]>(ruta,formData).pipe(
      map((res) => {
        this.imagenes = JSON.parse(JSON.stringify(res));
        return this.imagenes;
      })
    )
   }*/

  /* buscarAdjuntos(ID_EST_DOC): Observable<Adjunto[]>{
    const ruta =this.u+"busca_adjunto.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
      return this.http.post<Adjunto[]>(ruta,formData).pipe(
        map((res) => {
          this.adjuntos = JSON.parse(JSON.stringify(res));
          return this.adjuntos;
        })
      )
  }*/

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

 /* buscarCertificado(ID_EST_DOC): Observable<Certificado[]>{
    const ruta =this.u+"buscar_certificado.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    return this.http.post<Certificado[]>(ruta,formData).pipe(
      map((res) => {
        this.certificados = JSON.parse(JSON.stringify(res));
        return this.certificados;
      })
    )
   }*/
/*
   insertarTramite(ID_EST_DOC,ESTADO,OBSERVACIONES){
    const ruta = "https://cameronian-treatmen.000webhostapp.com/angular/registrar_estado.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    formData.append("ESTADO",ESTADO);
    formData.append("OBSERVACIONES",OBSERVACIONES);
    return this.http.post(ruta,formData)
  }
*/
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
 /* uploadFile(archivo) {
    const ruta="https://cameronian-treatmen.000webhostapp.com/angular/subir_archivo.php"
    return this.http.post(
      ruta, 
      JSON.stringify(archivo));
  }
  */
  uploadFile(archivo) {
    console.log('SERVICIO API upload file')
    console.log(archivo)
    return this.http.post(`${environment.API_URL}/tramite/updatecertificado`, archivo);
  }
/*
  estadoUpdate(ID_EST_DOC,OBSERVACIONES,FECHA,ESTADO){
    const ruta = "https://cameronian-treatmen.000webhostapp.com/angular/actualizar_detalle.php";
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    formData.append("OBSERVACIONES",OBSERVACIONES);
    formData.append("FECHA",FECHA);
    formData.append("ESTADO",ESTADO);
    return this.http.post(ruta,formData)
  }
*/
/*
estadoUpdate(tramite:Detalle): Observable<Detalle>{
  console.log('Service recibe');
  console.log(tramite);
  return this.http
  .patch<Detalle>('http://localhost:3000/tramite/', tramite)
  .pipe(catchError(this.handlerError));
}*/


}
